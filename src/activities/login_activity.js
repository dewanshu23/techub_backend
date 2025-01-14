const models = require('../models/index.js');

const loginActivity = async (data) => {
    try {
        const results = models.runner(
            {
                query: `INSERT INTO login_activity (user_id, login_time) VALUES ($1,Current_timestamp),`,
                values: [data.id]
            }
        );
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = loginActivity;