const models = require('../models/index.js');

const loginActivity = async (data) => {
    try {
        // body conatains email, password fields 
        console.log(data);
        const { email, password } = data;
        console.log(email
            , password);
        // Check for existing user
        let existingUser = await checkLogin(email);
        const results=models.pool.query(`INSERT INTO login_activity (user_id, login_time) VALUES ($1,Current_timestamp),`, [existingUser.id]);
        if(!results){
            return false;
        }
        return true;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = loginActivity;