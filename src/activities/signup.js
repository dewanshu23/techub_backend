// controllers/signup.js
// const User = require('../models/User');
// const { createJWTToken } = require('../utils/auth');
const models = require('../models/index.js');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const validator = require("../validations")
const logEntry = require('./logEntry.js');

const signup = async (req, res) => {
    const joiOptions = {
        abortEarly: false,
        language: {
            key: '{{key}} ',
        },
    };
    try {
        // Validate the request body
        const resultValidation = await Joi.validate(req.body, validator.accountValidator.userAccountSignupSchema, joiOptions);
        if (resultValidation.isJoi === true) {
            await logEntry({user_id: 0, activity: 'Signup failed Validation error'});
            return res.status(400).json({message: resultValidation.error.details.map(x => x.message).join(', ')});
        }
        console.log("validated");
        console.log(req.body);
        // body conatains name, email, password, stream, passout, year, userrole, isverified fields 
        const {name, email, password, stream, passout, year, userRole} = req.body;

        // Check for existing user
        const existingUser = await checkSignup(email);
        if (existingUser) {
            await logEntry({user_id: existingUser.id, activity: 'Signup failed Email ' + email + ' already exists'});
            return res.status(200).json({message: 'Email already exists'});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        let query = `INSERT INTO users (name, email, password, stream, passout, year, userrole, isverified)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, false)`;
        let client = await models.pool.connect();
        let results = await client.query(query, [name, email, hashedPassword, stream, passout, year, userRole]);
        client.release();
        console.log(results);
        if (results.rowCount === 0) {
            await logEntry({user_id: 0, activity: 'Signup failed Email ' + email + ' not created'});
            return res.status(400).json({message: 'User not created'});
        }

        // get new user in db for login activity
        query = `SELECT *
                 FROM users
                 WHERE email = $1`;
        client = await models.pool.connect();
        results = await client.query(query, [email]);
        client.release();
        await logEntry({user_id: results.rows[0].id, activity: 'Signup successful for email ' + email});
        res.status(201).json({message: 'User created successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
};

const checkSignup = async (email) => {
    try {
        // Check for existing user in db if exists
        const query = `SELECT *
                       FROM users
                       WHERE email = $1`;
        const client = await models.pool.connect();
        const results = await client.query(query, [email]);
        client.release();
        const {rows} = results;

        if (rows.length) {
            return true;
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}


module.exports = signup;