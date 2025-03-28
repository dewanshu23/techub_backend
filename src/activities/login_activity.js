const models = require('../models/index.js');

const loginActivity = async (data) => {
    try {
        const results = await models.pool.query(`INSERT INTO login_activity (user_id)
                                                 VALUES ($1)`,
            [data.id]
        );
        console.log("loginActivity: ", results);
        return (results.rowCount > 0) ?? 0;
    } catch (err) {
        console.error(err);

    }
}

const logoutActivity = async (data) => {
    try {
        // Check if user has an active session (logout_time is NULL)
        const check = await models.pool.query(
            `SELECT *
             FROM login_activity
             WHERE user_id = $1
               AND logout_time IS NULL
             ORDER BY id DESC LIMIT 1`,
            [data.id]
        );

        console.log("check: ", check);

        // If no active session found, return null
        if (!check || check.rowCount === 0) {
            return false;
        }

        console.log("Logout activity found for user_id: " + data.id);

        // Update logout_time for the latest active session
        const results = await models.pool.query(
            `UPDATE login_activity
             SET logout_time = CURRENT_TIMESTAMP
             WHERE id = (SELECT id
                         FROM login_activity
                         WHERE user_id = $1
                         ORDER BY id DESC
                 LIMIT 1
                 )`,
            [data.id]
        );

        console.log("logoutActivity: ", results);

        return true;
    } catch (err) {
        console.error("Error in logoutActivity: ", err);
        return false;
    }
};

const checkLoginActivity = async (data) => {
    try {
        const check = await models.pool.query(`SELECT *
                                               FROM login_activity
                                               WHERE user_id = $1
                                                 AND logout_time IS NULL
                                               ORDER BY id DESC LIMIT 1`, [data.id]
        );
        console.log("checkLoginActivity: ", check);
        if (!check || check.rowCount === 0) {
            console.log("No login activity found for user_id: " + data.id);
            return false;
        }
        console.log("Login activity found for user_id: " + data.id);
        return true;

    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {loginActivity, logoutActivity, checkLoginActivity};