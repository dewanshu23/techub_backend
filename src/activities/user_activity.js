const models = require('../models/index.js');

const activityLogByUser = async (req, res) => {
    // get for login_activity and then activity_log both
    try {
        const results = await models.pool.query(`SELECT *
                                                 FROM login_activity
                                                 WHERE user_id = $1`, [req.body.id]);
        if (!results) {
            return res.status(400).json({message: 'No activity found'});
        }
        let finalResp = {login_activity: results.rows};
        const results2 = await models.pool.query(`SELECT *
                                                  FROM activity_log
                                                  WHERE user_id = $1`, [req.body.id]);
        if (!results2) {
            finalResp.activity_log = results2.rows ?? [];
            return res.status(200).json({message: 'Activity found', activity: finalResp});
        }
        finalResp.activity_log = results2.rows;
        return res.status(200).json({message: 'Activity found', activity: finalResp});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = activityLogByUser;