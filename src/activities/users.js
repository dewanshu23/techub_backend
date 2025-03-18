const models = require('../models/index.js');
const logEntry = require('./logEntry.js');

const getAllAluminis = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM users WHERE userrole = 'Alumini'`);
        if (!results) {
            return res.status(400).json({ message: 'No alumini found' });
        }
        return res.status(200).json({ message: 'Aluminis found', alumini: results.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllStudents = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM users WHERE userrole = 'Student'`);
        if (!results) {
            logEntry({ user_id: 0, activity: 'No students found. requested by ' + req.body.id ?? "admin" });
            return res.status(400).json({ message: 'No students found' });
        }
        logEntry({ user_id: 0, activity: 'Students found. requested by ' + req.body.id ?? "admin" });
        return res.status(200).json({ message: 'Students found', students: results.rows });
    }
    catch (err) {
        console.error(err);
        logEntry({ user_id: 0, activity: 'Students not found. requested by ' + req.body.id ?? "admin" + ' err: ' + err });
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllFollowedAluminisByStudent = async (req, res) => {
    try {
        let existingUser = await checkLogin(req.user.email);
        const results = await models.pool.query(`SELECT * FROM users WHERE id IN (SELECT alumini_id FROM follow WHERE student_id = $1)`, [existingUser.id]);
        if (!results) {
            return res.status(400).json({ message: 'No followed alumini found' });
        }
        return res.status(200).json({ message: 'Followed alumini found', followed_alumini: results.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllFollowedStudentsByAlumini = async (req, res) => {
    try {
        let existingUser = await checkLogin(req.user.email);
        const results = await models.pool.query(`SELECT * FROM users WHERE id IN (SELECT student_id FROM follow WHERE alumini_id = $1)`, [existingUser.id]);
        if (!results) {
            return res.status(400).json({ message: 'No followed student found' });
        }
        return res.status(200).json({ message: 'Followed student found', followed_student: results.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/** 
const userModel = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(200),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    stream VARCHAR(50),
    passout INTEGER,
    year VARCHAR(30),
    userRole VARCHAR(20),
    mobile VARCHAR(15),
    aboutMe TEXT,
    profilePic TEXT,
    status varchar(10) DEFAULT 'a',   // a - active, d - deleted, b - blocked
    otp VARCHAR(10),
    otpExpiry TIMESTAMP,
    isVerified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
**/

const updateUserStatus = async (req, res) => {
    try{
        const {id, status } = req.body;
        const results = await models.pool.query(`UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [status, id]);
        if (!results) {
            logEntry({ user_id: 0, activity: 'Update failed for user id '+ id??0 + ' by '+ req.user.email });
            return res.status(400).json({ message: 'Update failed' });
        }
        logEntry({ user_id: 0, activity: 'Update successful for user id '+ id + ' by '+ req.user.email });
        return res.status(200).json({ message: 'Update successful' });
    } catch (err) {
        console.error(err);
        logEntry({ user_id: 0, activity: 'Update failed Internal server error for user id '+(id??0)+'; err: ' + err + ' by '+ req.user.email });
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateUser = async (req, res) => {
    try{
        const {id, name, email, password, stream, passout, year, userRole, mobile, aboutMe, profilePic, isVerified } = req.body;
        const results = await models.pool.query(`UPDATE users SET name = $1, email = $2, stream = $4, passout = $5, year = $6, userRole = $7, mobile = $8, aboutMe = $9, profilePic = $10, isVerified = $11, updated_at = CURRENT_TIMESTAMP WHERE id = $12`, [name, email, password, stream, passout, year, userRole, mobile, aboutMe, profilePic, isVerified, id]);
        if (!results) {
            logEntry({ user_id: 0, activity: 'Update failed for user id '+ id??0 });
            return res.status(400).json({ message: 'Update failed' });
        }
        logEntry({ user_id: 0, activity: 'Update successful for user id '+ id });
        return res.status(200).json({ message: 'Update successful' });
    } catch (err) {
        console.error(err);
        logEntry({ user_id: 0, activity: 'Update failed Internal server error for user id '+(id??0)+'; err: ' + err });
        res.status(500).json({ message: 'Internal server error' });
    }
}

const followAlumini = async (req, res) => {
    try {
        let existingUser = await checkLogin(req.user.email);
        const { alumini_id } = req.body;
        const results = await models.pool.query(`INSERT INTO follow (student_id, alumini_id) VALUES ($1, $2)`, [existingUser.id, alumini_id]);
        if (!results) {
            return res.status(400).json({ message: 'Follow failed' });
        }
        return res.status(200).json({ message: 'Follow successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    getAllAluminis,
    getAllStudents,
    getAllFollowedAluminisByStudent,
    getAllFollowedStudentsByAlumini,
    updateUser,
    updateUserStatus,
    followAlumini
};