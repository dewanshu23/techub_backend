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
        console.log(req.body);
        const {email, password} = req.body;
        console.log(email, password);
        // Check for existing user
        existingUser = await checkUser(email);
        if (!existingUser) {
            await logEntry({user_id: 0, activity: 'Login failed Email ' + email + ' does not exist'});
            return res.status(400).json({message: 'Email does not exist'});
        }
        // Check if password is correct
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
        console.log(existingUser);

        // create JWT token
        const JWT_SECRET = 'secretkey';
        const token = JWT.sign({email: existingUser.email}, JWT_SECRET, {expiresIn: '168h'});
        await loginActivity({id: existingUser.id});
        // Send token in response
        await logEntry({
            user_id: existingUser.id,
            activity: 'Login successful for email ' + email + ' and userid ' + existingUser.id
        });
        res.status(200).json({message: 'Login successful', token, user_data: existingUser});
    } catch (err) {
        console.error(err);
        await logEntry({
            user_id: existingUser != undefined ? existingUser.id : 0,
            activity: 'Login failed Internal server error'
        });
        res.status(500).json({message: 'Internal server error'});
    }
}


const checkUser = async (email) => {
    try {
        // Check for existing user in db if exists
        const query = `SELECT * FROM users WHERE email = $1`;
        const client = await models.pool.connect();
        const results = await client.query(query, [email]);
        client.release();
        const {rows} = results;
        console.log(rows)
        if (rows.length) {
            return rows[0];
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = login;
