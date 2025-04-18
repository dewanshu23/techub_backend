const express = require('express');
const cors = require('cors');
const app = express();
const src = require('./src/index.js');
const controllers = src.activities;

const models = src.models;

models.processIndexFile().then(() => {
    console.log("DB segtup and checkup done");
});

app.use(cors());
app.use(express.json(
));  // For JSON bodies
app.use(express.urlencoded({extended: true}));  // For URL-encoded bodies
app.set('port', 7070);
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// auth routes
app.post('/signup',
    async (req, res) => {
        await controllers.signup(req, res)
    }
);

app.post('/login',
    async (req, res) => {
        await controllers.login.login(req, res)
    }
);

app.post('/logout',
    async (req, res) => {
        await controllers.login.logout(req, res)
    }
);


app.post('changePassword',
    async (req, res) => {
        await controllers.login.changePassword(req, res)
    }
);

app.post('/forgotPassword',
    async (req, res) => {
        await controllers.login.forgotPassword(req, res)
    }
);

app.post('/resetPassword',
    async (req, res) => {
        await controllers.login.resetPassword(req, res)
    }
);

app.post('/updateProfile',
    async (req, res) => {
        await controllers.users.updateUser(req, res)
    }
);

app.post('/updateUserStatus',
    async (req, res) => {
        await controllers.users.updateUserStatus(req, res)
    }
);

// post routes for alumni and student
app.post('/post',
    async (req, res) => {
        await controllers.posts.createPost(req, res)
    }
);

app.get('/getAllPosts',
    async (req, res) => {
        await controllers.posts.getAllPosts(req, res)
    }
);

app.get('/getAllPostsByType',
    async (req, res) => {
        await controllers.posts.getAllPostsByType(req, res)
    }
);

app.post('/updatePost',
    async (req, res) => {
        await controllers.posts.updatePost(req, res)
    }
);

app.get('/deletePost',
    async (req, res) => {
        await controllers.posts.deletePost(req, res)
    }
);

// user list routes
app.get('/getAllUsers',
    async (req, res) => {
        await controllers.users.getAllUsers(req, res)
    }
);

app.get('/getAllAlumnis',
    async (req, res) => {
        await controllers.users.getAllAlumnis(req, res)
    }
);

app.get('/getAllStudents',
    async (req, res) => {
        await controllers.users.getAllStudents(req, res)
    }
);

// chat routes
app.post('/chatEntry',
    async (req, res) => {
        await controllers.chat.chatEntry(req, res)
    }
);

app.get('/getChatForUser',
    async (req, res) => {
        await controllers.chat.getChatForUser(req, res)
    }
);

app.get('/getAllChats',
    async (req, res) => {
        await controllers.chat.getAllChats(req, res)
    }
);

// activity log routes
app.get('/activityLogByUser',
    async (req, res) => {
        await controllers.userActivity(req, res)
    }
);

// general listening route
app.listen(app.get('port'),
    function () {
        console.log('Express server listening on port ' + app.get('port'));
    }
);