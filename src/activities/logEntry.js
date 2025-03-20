const models = require('../models/index.js');

const logEntry = async (data) => {
    try {
        // data contains user_id, activity text fields
        const results = models.runner(
            {
                query: `INSERT INTO activity_log (user_id, activity, activity_time) VALUES ($1, $2, Current_timestamp)`,
                values: [data.user_id, data.activity]
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = logEntry;