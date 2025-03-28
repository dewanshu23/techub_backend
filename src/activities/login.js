const models = require('../models/index.js');
const bcrypt = require('bcryptjs');
const e = require('express');
const JWT = require('jsonwebtoken');
const loginActivity = require('./login_activity.js');
const logEntry = require('./logEntry.js');

const login = async (req, res) => {
    let existingUser;
    try {
        // body conatains email, password fields 
        const {email, password} = req.body;
        // Check for existing user
        existingUser = await checkUser(email);
        if (!existingUser) {
            await logEntry({user_id: 0, activity: 'Login failed Email ' + email + ' does not exist'});
            return res.status(400).json({message: 'Email does not exist'});
        }
        // Check if password is correct
        if (existingUser.status === "b") {
            await logEntry({user_id: existingUser.id, activity: 'Login blocked for user ' + email});
            return res.status(403).json({message: 'Your account is blocked'});
        }

        //check already logged in
        const check = await loginActivity.checkLoginActivity({id: existingUser.id});
        if (check) {
            await logEntry({user_id: existingUser.id, activity: 'Login failed User already logged in'});
            return res.status(200).json({message: 'User already logged in'});
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            await logEntry({
                user_id: existingUser.id,
                activity: 'Login failed Password does not match for email ' + email + ' and userid ' + existingUser.id
            });
            return res.status(400).json({message: 'Invalid password'});
        }
        delete existingUser.password;
        delete existingUser.otp;
        delete existingUser.otpexpiry;

        const JWT_SECRET = 'secretkey';
        const token = JWT.sign({email: existingUser.email}, JWT_SECRET, {expiresIn: '168h'});
        await loginActivity.loginActivity({id: existingUser.id});
        await logEntry({
            user_id: existingUser.id,
            activity: 'Login successful for email ' + email + ' and userid ' + existingUser.id
        });
        res.status(200).json({message: 'Login successful', token, user_data: existingUser});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}


const checkUser = async (email) => {
    try {
        const query = `SELECT * FROM users WHERE email = $1`;
        const client = await models.pool.connect();
        const results = await client.query(query, [email]);
        client.release();
        const {rows} = results;
        if (rows.length) {
            return rows[0];
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const logout = async (req, res) => {
    try {
        const user_id = req.body.id;
        var resp = await loginActivity.logoutActivity({id: user_id});
        if (resp === false) {
            logEntry({user_id: user_id, activity: 'User not logged in'});
            return res.status(400).json({message: 'User not logged in'});
        }
        await logEntry({user_id: user_id, activity: 'Logout successful for user_id ' + user_id});
        res.status(200).json({message: 'Logout successful'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {login, logout};
