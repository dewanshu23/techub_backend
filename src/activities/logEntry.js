const models = require('../models/index.js');

const logEntry = async (data) => {
    try {
        const results = await models.pool.query(
            `INSERT INTO activity_log (user_id, activity)
             VALUES ($1, $2)`,
            [data.user_id, data.activity]
        );
        return results.rowCount > 0;
    } catch (err) {
        console.error(err);
        return false;
    }
}


module.exports = logEntry;