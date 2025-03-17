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

const updateUser = async (req, res) => {
    
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
    followAlumini
};