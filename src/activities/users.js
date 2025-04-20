const models = require('../models/index.js');
const logEntry = require('./logEntry.js');

const getAllUsers = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM users WHERE userrole not in ('Admin') AND status != 'd'`);
        if (!results) {
            return res.status(400).json({message: 'No User found'});
        }
        return res.status(200).json({message: 'Users found', alumni: results.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

const getAllAlumnis = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM users WHERE userrole = 'Alumni'`);
        if (!results) {
            return res.status(400).json({message: 'No alumni found'});
        }
        return res.status(200).json({message: 'Alumnis found', alumni: results.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

const getAllStudents = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM users WHERE userrole = 'Student'`);
        if (!results) {
            logEntry({
                user_id: req.body.id ?? 1,
                activity: 'No students found. requested by ' + req.body.id ?? "admin"
            });
            return res.status(400).json({message: 'No students found'});
        }
        logEntry({user_id: req.body.id ?? 1, activity: 'Students found. requested by ' + req.body.id ?? "admin"});
        return res.status(200).json({message: 'Students found', students: results.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

const updateUserStatus = async (req, res) => {
    const {id, status} = req.query;
    const {doer, email, userrole} = req.body;
    try {
        const results = await models.pool.query(`UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [status, id]);
        if (!results) {
            logEntry({
                user_id: doer,
                activity: 'Update failed for user id ' + id ?? 0 + ' by ' + email ?? "" + " id " + doer + " to " + status
            });
            return res.status(400).json({message: 'Update failed'});
        }
        await logEntry({
            user_id: doer,
            activity: 'Update successful for user id ' + id ?? 0 + ' by ' + email ?? "" + " id " + doer + " to " + status
        });
        return res.status(200).json({message: 'Update successful'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

const updateUser = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const stream = req.body.stream;
    const passout = req.body.passout;
    const year = req.body.year;
    const userRole = req.body.userrole;
    const mobile = req.body.mobile;
    const aboutMe = req.body.aboutMe;
    const profilePic = req.body.profilepic;
    const isVerified = req.body.isverified;
    const linkedin = req.body.linkedin;
    const twitter = req.body.twitter;
    try {
        const results = await models.pool.query(`UPDATE users SET name = $1, email = $2, stream = $3, passout = $4, year = $5, userRole = $6, mobile = $7, aboutMe = $8, profilePic = $9, isVerified = $10, linkedin = $11, twitter = $12 updated_at = CURRENT_TIMESTAMP WHERE id = $13`, [name, email, stream, passout, year, userRole, mobile, aboutMe, profilePic, isVerified, linkedin, twitter, id]);
        if (!results) {
            await logEntry({user_id: id ?? 0, activity: 'Update failed for user id ' + id ?? 0});
            return res.status(400).json({message: 'Update failed'});
        }
        await logEntry({user_id: id ?? 0, activity: 'Update successful for user id ' + id ?? 0});
        return res.status(200).json({message: 'Update successful', success: results.rowCount > 0});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {
    getAllUsers,
    getAllAlumnis,
    getAllStudents,
    updateUser,
    updateUserStatus
};