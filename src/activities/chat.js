const e = require('express');
const models = require('../models/index.js');
const logEntry = require('./logEntry.js');

const chatEntry = async (req, res) => {
    try {
        // body conatains email, password fields 
        console.log(req.body);
        const {chat_content, user_id} = req.body;
        console.log(chat_content, user_id);
        // Check for existing user
        // let existingUser = await checkLogin(req.user.email);
        const results = await models.pool.query(`INSERT INTO chat (user_id, chat_content)
                                                 VALUES ($1, $2)`, [user_id, chat_content]);
        if (!results) {
            await logEntry({user_id: user_id, activity: 'Chat creation failed for userid ' + user_id});
            return res.status(400).json({message: 'Chat failed'});
        }
        await logEntry({user_id: user_id, activity: 'Chat successful for userid ' + user_id});
        return res.status(200).json({message: 'Chat successful'});
    } catch (err) {
        console.error(err);
        await logEntry({user_id: 0, activity: 'Chat failed Internal server error; err: ' + err});
        res.status(500).json({message: 'Internal server error'});
    }
}

const getChatForUser = async (req, res) => {
    try {
        // Check for existing user
        let existingUser = await checkLogin(req.body.email);
        const results = await models.pool.query(`SELECT *
                                                 FROM chat
                                                 WHERE user_id = $1`, [existingUser.id]);
        if (!results) {
            return res.status(400).json({message: 'No chat found'});
        }
        return res.status(200).json({message: 'Chat found', chat: results.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

const getAllChats = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT *
                                                 FROM chat`);
        if (!results || 1 > results.rows.length) {
            return res.status(400).json({message: 'No chat found'});
        }
        let finalResp = {chats: results.rows}
        let distinctUsers = [...new Set(results.rows.map(item => item.user_id))];
        let users = [];
        for (let i = 0; i < distinctUsers.length; i++) {
            let user = await models.pool.query(`SELECT id, email, name
                                                FROM users
                                                WHERE id = $1`, [distinctUsers[i]]);
            users.push(user.rows[0]);
        }
        finalResp.users = users;
        return res.status(200).json({message: 'Chat found', chat: finalResp});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {
    chatEntry,
    getChatForUser,
    getAllChats
};