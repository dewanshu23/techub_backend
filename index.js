const express = require('express');
const cors = require('cors');
const app = express();
const src = require('./src/index.js');
const controllers = src.activities;
//
//connect db from models folder
const models = src.models;

models.processIndexFile().then(() => {
    console.log("DB segtup and checkup done");
});

app.use(cors());
app.use(express.json(
));  // For JSON bodies
app.use(express.urlencoded({extended: true})); // For URL-encoded bodies
// app.use(express.static('public')); // For serving static files
//connect routes from routes folder
app.set('port', 7070);
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// auth routes
app.post('/signup',
    async (req, res) => {
        console.log("was i called");
        await controllers.signup(req, res)
    }
);
app.post('/login',
    async (req, res) => {
        await controllers.login(req, res)
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

app.get('/verify-email',
    function (req, res) {
        res.send('Verify Email Page');
    }
);

app.get('/forgot-password',
    function (req, res) {
        res.send('Forgot Password Page');
    }
);

app.get('/reset-password',
    function (req, res) {
        res.send('Reset Password Page');
    }
);

// post routes for alumni and student
app.post('/post',
    async (req, res) => {
        await controllers.posts.post(req, res)
    }
);

app.get('/getPostsForUser',
    async (req, res) => {
        await controllers.posts.getPostsForUser(req, res)
    }
);

app.get('/getAllPosts',
    async (req, res) => {
        await controllers.posts.getAllPosts(req, res)
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

app.get('/getAllFollowedAlumnisByStudent',
    async (req, res) => {
        await controllers.users.getAllFollowedAlumnisByStudent(req, res)
    }
);

app.get('/getAllFollowedStudentsByAlumni',
    async (req, res) => {
        await controllers.users.getAllFollowedStudentsByAlumni(req, res)
    }
);

app.get('/followAlumni',
    async (req, res) => {
        await controllers.users.followAlumni(req, res)
    }
);

app.get('/followStudent',
    async (req, res) => {
        await controllers.users.followStudent(req, res)
    }
);

app.get('/unfollowAlumni',
    async (req, res) => {
        await controllers.users.unfollowAlumni(req, res)
    }
);

app.get('/unfollowStudent',

    async (req, res) => {
        await controllers.users.unfollowStudent(req, res)
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

app.listen(app.get('port'),
    function () {
        console.log('Express server listening on port ' + app.get('port'));
    }
);