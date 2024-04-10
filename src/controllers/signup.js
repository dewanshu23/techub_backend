// controllers/signup.js
// const User = require('../models/User');
// const { createJWTToken } = require('../utils/auth');
const models = require('../models/index.js');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const validator = require("../validations")

const signup = async (req, res) => {
    const joiOptions = {
        abortEarly: false,
        language: {
          key: '{{key}} ',
        },
      };
    try {
        // Validate the request body
        const resultValidation=await Joi.validate(req.body, validator.accountValidator.userAccountSignupSchema, joiOptions);      
        if(resultValidation.isJoi===true){
            return res.status(400).json({ message: resultValidation.error.details.map(x=>x.message).join(', ') });
        }  
        console.log("validated");
        console.log(req.body);
        // body conatains name, email, password, stream, passout, year, userrole, isverified fields 
        const { name, email, password, stream, passout, year, userRole } = req.body;



        // Check for existing user
        const existingUser = await checkSignup(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const query = `INSERT INTO users (name, email, password, stream, passout, year, userrole, isverified, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
        const client = await models.pool.connect();
        const results = await client.query(query, [name, email, hashedPassword, stream, passout, year, userRole]);
        client.release();
        console.log(results);
        if(results.rowCount===0){
            return res.status(400).json({ message: 'User not created' });
        }
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const checkSignup = async (email) => {
    try {
        // Check for existing user in db if exists
        const query = `SELECT * FROM users WHERE email = $1`;
        const client = await models.pool.connect();
        const results = await client.query(query, [email]);
        client.release();
        const { rows } = results;

        if (rows.length) {
            return true;
        }
        return false;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}


module.exports = signup;