const models = require('../models/index.js');

const loginActivity = async (data) => {
    try {
        const results = await models.pool.query(`INSERT INTO login_activity (user_id)
                                                 VALUES ($1)`,
            [data.id]
        );
        return (results.rowCount > 0) ?? 0;
    } catch (err) {
        console.error(err);

    }
}

const logoutActivity = async (data) => {
    try {
        const check = await models.pool.query(
            `SELECT *
             FROM login_activity
             WHERE user_id = $1
               AND logout_time IS NULL
             ORDER BY id DESC LIMIT 1`,
            [data.id]
        );

        if (!check || check.rowCount === 0) {
            return false;
        }

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
        if (!check || check.rowCount === 0) {
            return false;
        }
        return true;

    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {loginActivity, logoutActivity, checkLoginActivity};