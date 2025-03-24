const models = require('../models/index.js');
const logEntry = require('./logEntry.js');

const typeMap = {
    j: 'Job',
    n: 'Notification',
    e: 'Event'
};

const createPost = async (req, res) => {
    try {
        let {user_id, content, description, title, start_date, end_date, type, status, for_user} = req.body;
        status = 'r';
        for_user = 'all';

        const results = await models.pool.query(
            `INSERT INTO posts (user_id, content, description, title, start_date, end_date, type, status, for_user)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [user_id, content, description, title, start_date, end_date, type, status, for_user]
        );

        if (!results || results.rowCount <= 0) {
            await logEntry({user_id, activity: `Post creation failed for user_id ${user_id} of type ${type}`});
            return res.status(400).json({message: 'Post creation failed'});
        }

        await logEntry({user_id, activity: `Post creation successful for user_id ${user_id} of type ${type}`});
        return res.status(201).json({message: 'Post created successfully'});
    } catch (e) {
        console.error(e);
        await logEntry({user_id: 0, activity: `Post creation failed with error: ${e.message}`});
        res.status(500).json({message: 'Internal server error'});
    }
};

const getAllPosts = async (req, res) => {
    try {
        let {user_id} = req.body;
        const results = await models.pool.query(`SELECT *
                                                 FROM posts`);

        if (!results || results.rowCount === 0) {
            await logEntry({user_id, activity: `Post fetch failed for user_id ${user_id}`});
            return res.status(404).json({message: 'No posts found'});
        }

        await logEntry({user_id, activity: `Post fetch successful for user_id ${user_id}`});
        return res.status(200).json({message: 'Posts fetched successfully', data: results.rows});
    } catch (e) {
        console.error(e);
        await logEntry({user_id: 0, activity: `Post fetch failed with error: ${e.message}`});
        res.status(500).json({message: 'Internal server error'});
    }
};

const getAllPostsByType = async (req, res) => {
    try {
        const {user_id, type} = req.params;

        if (!['j', 'n', 'e'].includes(type)) {
            return res.status(400).json({message: 'Invalid post type'});
        }

        const results = await models.pool.query(
            'SELECT * FROM posts WHERE user_id = $1 AND type = $2',
            [user_id, type]
        );

        if (results.rowCount === 0) {
            await logEntry({user_id, activity: `No posts found for type ${typeMap[type]} by user_id ${user_id}`});
            return res.status(404).json({message: `No posts found for type ${typeMap[type]}`});
        }

        await logEntry({user_id, activity: `Post fetch for type ${typeMap[type]} by user_id ${user_id}`});

        return res.status(200).json({
            message: `Posts of type ${typeMap[type]} fetched successfully`,
            posts: results.rows
        });

    } catch (err) {
        console.error('Error fetching posts by type:', err);
        await logEntry({user_id, activity: `Post fetch for type ${typeMap[type]} failed with error: ${err.message}`});
        res.status(500).json({message: 'Internal server error'});
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getAllPostsByType
};
