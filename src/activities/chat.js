const e = require('express');
const models = require('../models/index.js');
const logEntry = require('./logEntry.js');

const chatEntry = async (req, res) => {
    try {
        // body conatains email, password fields 
        console.log(req.body);
        const { chat_content, user_id } = req.body;
        console.log(chat_content, user_id);
        // Check for existing user
        // let existingUser = await checkLogin(req.user.email);
        const results = await models.pool.query(`INSERT INTO chat (user_id, chat_content) VALUES ($1, $2)`, [user_id, chat_content]);
        if (!results) {
            await logEntry({ user_id: user_id, activity: 'Chat creation failed for userid ' + user_id });
            return res.status(400).json({ message: 'Chat failed' });
        }
        await logEntry({ user_id: user_id, activity: 'Chat successful for userid ' + user_id + ' and chatid ' + results.rows[0].id });
        return res.status(200).json({ message: 'Chat successful' });
    }
    catch (err) {
        console.error(err);
        await logEntry({ user_id: 0, activity: 'Chat failed Internal server error; err: ' + err });
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getChatForUser = async (req, res) => {
    try {
        // Check for existing user
        let existingUser = await checkLogin(req.body.email);
        const results = await models.pool.query(`SELECT * FROM chat WHERE user_id = $1`, [existingUser.id]);
        if (!results) {
            await logEntry({ user_id: existingUser.id, activity: 'No chat found for userid ' + existingUser.id });
            return res.status(400).json({ message: 'No chat found' });
        }
        await logEntry({ user_id: existingUser.id, activity: 'Chat found for userid ' + existingUser.id });
        return res.status(200).json({ message: 'Chat found', chat: results.rows });
    }
    catch (err) {
        console.error(err);
        await logEntry({ user_id: 0, activity: 'Chat failed Internal server error; err: ' + err });
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllChat = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM chat`);
        if (!results) {
            await logEntry({ user_id: 0, activity: 'No chat created yet asked by ' + req.body.id??"admin" });
            return res.status(400).json({ message: 'No chat found' });
        }
        await logEntry({ user_id: 0, activity: 'All Chat found and sent to user id ' + req.body.id??"admin" });
        return res.status(200).json({ message: 'Chat found', chat: results.rows });
    }
    catch (err) {
        console.error(err);
        await logEntry({ user_id: 0, activity: 'Chat failed Internal server error; asked by ' + req.body.id??"admin" + ' err: ' + err });
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { chatEntry, getChatForUser, getAllChat };