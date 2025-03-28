const models = require('../models/index.js');
const logEntry = require('./logEntry.js');

const typeMap = {
    j: 'Job',
    n: 'Notification',
    e: 'Event'
};

const createPost = async (req, res) => {
    try {
        let user_id = req.body.user_id;
        let content = req.body.content;
        let description = req.body.description;
        let title = req.body.title;
        let start_date = req.body.start_date && req.body.start_date != "" ? new Date(req.body.start_date) : null;
        let end_date = req.body.end_date && req.body.end_date != "" ? new Date(req.body.end_date) : null;
        let type = req.body.type;
        const status = 'r';
        const for_user = 'all';

        start_date = (start_date && start_date !== "") ? new Date(start_date) : null;
        end_date = (end_date && end_date !== "") ? new Date(end_date) : null;

        const results = await models.pool.query(
            `INSERT INTO posts (user_id, content, description, title, start_date, end_date, type, status, for_user)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [user_id, content, description, title, start_date, end_date, type, status, for_user]
        );

        if (!results || results.rowCount <= 0) {
            await logEntry({user_id, activity: `Post creation failed for user_id ${user_id} of type ${typeMap[type]}`});
            return res.status(400).json({message: 'Post creation failed'});
        }

        await logEntry({user_id, activity: `Post creation successful for user_id ${user_id} of type ${typeMap[type]}`});
        return res.status(201).json({message: 'Post created successfully'});
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Internal server error'});
    }
};

const getAllPosts = async (req, res) => {
    try {
        const {user_id} = req.body;
        const results = await models.pool.query(`SELECT *
                                                 FROM posts
                                                 where status not in ('d')`);

        if (!results || results.rowCount === 0) {
            await logEntry({user_id, activity: `Post fetch failed for user_id ${user_id}`});
            return res.status(404).json({message: 'No posts found'});
        }

        await logEntry({user_id, activity: `Post fetch successful for user_id ${user_id}`});
        return res.status(200).json({message: 'Posts fetched successfully', data: results.rows});
    } catch (e) {
        console.error(e);
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
            'SELECT * FROM posts WHERE type = $1',
            [type]
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
        res.status(500).json({message: 'Internal server error'});
    }
};

const updatePost = async (req, res) => {
    try {
        let id = req.body.id;
        let user_id = req.body.user_id;
        let content = req.body.content;
        let description = req.body.description;
        let title = req.body.title;
        let start_date = req.body.start_date && req.body.start_date != "" ? new Date(req.body.start_date) : null;
        let end_date = req.body.end_date && req.body.end_date != "" ? new Date(req.body.end_date) : null;
        let type = req.body.type;
        let status = req.body.status;
        let for_user = req.body.for_user;

        const results = await models.pool.query(
            `UPDATE posts
             SET content = $1,
                 description = $2,
                 title = $3,
                 start_date = $4,
                 end_date = $5,
                 type = $6,
                 status = $7,
                 for_user = $8
             WHERE id = $9`,
            [content, description, title, start_date, end_date, type, status, for_user, id]
        );

        if (!results || results.rowCount <= 0) {
            await logEntry({user_id, activity: `Post update failed for post_id ${id} by user_id ${user_id}`});
            return res.status(400).json({message: 'Post update failed'});
        }

        await logEntry({user_id, activity: `Post update successful for post_id ${id} by user_id ${user_id}`});
        return res.status(200).json({message: 'Post updated successfully'});
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Internal server error'});
    }
};

const deletePost = async (req, res) => {
    try {
        const {post_id, user_id} = req.params;

        const post = await models.pool.query(`SELECT *
                                              FROM posts
                                              WHERE id = $1`, [post_id]);

        if (!post || post.rowCount === 0) {
            await logEntry({
                user_id,
                activity: `Post not found for deletion. post_id: ${post_id}, user_id: ${user_id}`
            });
            return res.status(404).json({message: 'Post not found'});
        }

        if (post.rows[0].status === 'd') {
            await logEntry({
                user_id,
                activity: `Post deletion failed for post_id ${post_id} by user_id ${user_id} is already deleted`
            });
            return res.status(400).json({message: 'Post already deleted'});
        }

        const results = await models.pool.query(
            `UPDATE posts
             SET status = 'd'
             WHERE id = $1`,
            [post_id]
        );

        if (!results || results.rowCount <= 0) {
            await logEntry({user_id, activity: `Post deletion failed for post_id ${post_id} by user_id ${user_id}`});
            return res.status(400).json({message: 'Post deletion failed'});
        }

        await logEntry({user_id, activity: `Post deletion successful for post_id ${post_id} by user_id ${user_id}`});
        return res.status(200).json({message: 'Post deleted successfully'});
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Internal server error'});
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getAllPostsByType,
    updatePost,
    deletePost
};
