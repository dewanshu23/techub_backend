const models = require('../models/index.js');

const logEntry = async (data) => {
    try {
        // data contains user_id, activity text fields
        const results = await models.pool.query(
            `INSERT INTO activity_log (user_id, activity)
             VALUES ($1, $2)`,
            [data.user_id, data.activity]
        );
        console.log("logEntry: ", results);
        return results.rowCount > 0;
    } catch (err) {
        console.error(err);
        // res.status(500).json({message: 'Internal server error'});
    }
}


module.exports = logEntry;