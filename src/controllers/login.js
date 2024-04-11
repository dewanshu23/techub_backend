const models = require('../models/index.js');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        // body conatains email, password fields 
        console.log(req.body);
        const { email, password } = req.body;
        console.log(email, password);
        // Check for existing user
        let existingUser = await checkLogin(email);
        if (!existingUser) {
            return res.status(400).json({ message: 'Email does not exist' });
        }
        // Check if password is correct
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        delete existingUser.password;
        delete existingUser.otp;
        delete existingUser.otpexpiry;
        console.log(existingUser);

        // create JWT token
        const JWT_SECRET = 'secretkey';
        const token = JWT.sign({ email: existingUser.email }, JWT_SECRET, { expiresIn: '168h' });

        // Send token in response
        res.status(200).json({ message: 'Login successful', token, });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const checkLogin = async (email) => {
    try {
        // Check for existing user in db if exists
        console.log(email);
        const query = `SELECT * FROM users WHERE email = $1`;
        const { rows } = await models.pool.query(query, [email]);
        console.log(rows);
        if (rows.length) {
            return rows[0];
        }
        return false;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = login;
