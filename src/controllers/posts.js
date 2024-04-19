const models = require('../models/index.js');

const post = async (req, res) => {
    try {
        // body conatains email, password fields 
        console.log(req.body);
        const { post_content, post_image } = req.body;
        console.log(post_content, post_image);
        // Check for existing user
        let existingUser = await checkLogin(req.user.email);
        const results = await models.pool.query(`INSERT INTO posts (user_id, post_content, post_image) VALUES ($1, $2, $3)`, [existingUser.id, post_content, post_image]);
        if (!results) {
            return res.status(400).json({ message: 'Post failed' });
        }
        return res.status(200).json({ message: 'Post successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getPostsForUser = async (req, res) => {
    try {
        // Check for existing user
        let existingUser = await checkLogin(req.user.email);
        const results = await models.pool.query(`SELECT * FROM posts WHERE user_id = $1`, [existingUser.id]);
        if (!results) {
            return res.status(400).json({ message: 'No posts found' });
        }
        return res.status(200).json({ message: 'Posts found', posts: results.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM posts`);
        if (!results) {
            return res.status(400).json({ message: 'No posts found' });
        }
        return res.status(200).json({ message: 'Posts found', posts: results.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    post,
    getPostsForUser,
    getAllPosts
};