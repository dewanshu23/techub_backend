const models = require('../models/index.js');
const logEntry = require('./logEntry.js');

const post = async (req, res) => {
    try {
        // body conatains email, password fields 
        console.log(req.body);
        const { post_content, post_image, user_id } = req.body;
        console.log(post_content, post_image, user_id);
        // Check for existing user
        // let existingUser = await checkLogin(req.user.email);
        const results = await models.pool.query(`INSERT INTO posts (user_id, post_content, post_image) VALUES ($1, $2, $3)`, [user_id, post_content, post_image]);
        if (!results) {
            await logEntry({ user_id: user_id, activity: 'Post creation failed for userid ' + user_id });
            return res.status(400).json({ message: 'Post failed' });
        }
        await logEntry({ user_id: user_id, activity: 'Post successful for userid ' + user_id + ' and postid ' + results.rows[0].id });
        return res.status(200).json({ message: 'Post successful' });
    }
    catch (err) {
        console.error(err);
        await logEntry({ user_id: 0, activity: 'Post failed Internal server error; err: ' + err });
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getPostsForUser = async (req, res) => {
    try {
        // Check for existing user
        let existingUser = await checkLogin(req.body.email);
        const results = await models.pool.query(`SELECT * FROM posts WHERE user_id = $1`, [existingUser.id]);
        if (!results) {
            await logEntry({ user_id: existingUser.id, activity: 'No posts found for userid ' + existingUser.id });
            return res.status(400).json({ message: 'No posts found' });
        }
        await logEntry({ user_id: existingUser.id, activity: 'Posts found for userid ' + existingUser.id });
        return res.status(200).json({ message: 'Posts found', posts: results.rows });
    }
    catch (err) {
        console.error(err);
        await logEntry({ user_id: 0, activity: 'Post failed Internal server error; err: ' + err });
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const results = await models.pool.query(`SELECT * FROM posts`);
        if (!results) {
            await logEntry({ user_id: 0, activity: 'No posts created yet asked by ' + req.body.id??"admin" });
            return res.status(400).json({ message: 'No posts found' });
        }
        await logEntry({ user_id: 0, activity: 'All Posts found and sent to user id ' + req.body.id??"admin" });
        return res.status(200).json({ message: 'Posts found', posts: results.rows });
    }
    catch (err) {
        console.error(err);
        await logEntry({ user_id: 0, activity: 'Post failed Internal server error; asked by ' + req.body.id??"admin" + ' err: ' + err });
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    post,
    getPostsForUser,
    getAllPosts
};