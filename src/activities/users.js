const models = require('../models/index.js');
const logEntry = require('./logEntry.js');

const getAllUsers = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM users WHERE userrole not in ('Admin')`);
        if (!results) {
            return res.status(400).json({ message: 'No User found' });
        }
        return res.status(200).json({ message: 'Users found', alumni: results.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllAlumnis = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM users WHERE userrole = 'Alumni'`);
        if (!results) {
            return res.status(400).json({ message: 'No alumni found' });
        }
        return res.status(200).json({ message: 'Alumnis found', alumni: results.rows });
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

const getAllFollowedAlumnisByStudent = async (req, res) => {
    try {
        let existingUser = await checkLogin(req.user.email);
        const results = await models.pool.query(`SELECT * FROM users WHERE id IN (SELECT alumni_id FROM follow WHERE student_id = $1)`, [existingUser.id]);
        if (!results) {
            return res.status(400).json({ message: 'No followed alumni found' });
        }
        return res.status(200).json({ message: 'Followed alumni found', followed_alumni: results.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllFollowedStudentsByAlumni = async (req, res) => {
    try {
        let existingUser = await checkLogin(req.user.email);
        const results = await models.pool.query(`SELECT * FROM users WHERE id IN (SELECT student_id FROM follow WHERE alumni_id = $1)`, [existingUser.id]);
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

const updateUserStatus = async (req, res) => {
    const { id, status } = req.query;
    const {doer, email , userrole} = req.body;
    try {
        const results = await models.pool.query(`UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [status, id]);
        if (!results) {
            logEntry({ user_id: 0, activity: 'Update failed for user id ' + id ?? 0 + ' by ' + email ?? "" + " id " + doer + " to " + status });
            return res.status(400).json({ message: 'Update failed' });
        }
        logEntry({ user_id: 0, activity: 'Update successful for user id ' + id??0 + ' by ' + email ?? "" + " id " + doer + " to " + status });
        return res.status(200).json({ message: 'Update successful' });
    } catch (err) {
        console.error(err);
        logEntry({ user_id: 0, activity: 'Update failed Internal server error for user id ' + id + '; err: ' + err + ' by ' + email ?? "" + " id " + doer + " to " + req.body.status ?? "" });
        res.status(500).json({ message: 'Internal server error' });
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
    const isVerified = req.body.isperified;
    try {
        const results = await models.pool.query(`UPDATE users SET name = $1, email = $2, stream = $3, passout = $4, year = $5, userRole = $6, mobile = $7, aboutMe = $8, profilePic = $9, isVerified = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11`, [name, email, stream, passout, year, userRole, mobile, aboutMe, profilePic, isVerified, id]);
        if (!results) {
            logEntry({ user_id: 0, activity: 'Update failed for user id ' + id ?? 0 });
            return res.status(400).json({ message: 'Update failed' });
        }
        logEntry({ user_id: 0, activity: 'Update successful for user id ' + id });
        console.log(results);
        return res.status(200).json({ message: 'Update successful', success: results.rowCount > 0 });
    } catch (err) {
        console.error(err);
        logEntry({ user_id: 0, activity: 'Update failed Internal server error for user id ' + (id ?? 0) + '; err: ' + err });
        res.status(500).json({ message: 'Internal server error' });
    }
}

const followAlumni = async (req, res) => {
    try {
        let existingUser = await checkLogin(req.user.email);
        const { alumni_id } = req.body;
        const results = await models.pool.query(`INSERT INTO follow (student_id, alumni_id) VALUES ($1, $2)`, [existingUser.id, alumni_id]);
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
    getAllUsers,
    getAllAlumnis,
    getAllStudents,
    getAllFollowedAlumnisByStudent,
    getAllFollowedStudentsByAlumni,
    updateUser,
    updateUserStatus,
    followAlumni
};