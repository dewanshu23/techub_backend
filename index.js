const express = require('express');
const app = express();
const controllers = require('./src/controllers/index.js');
//
//connect db from models folder
const { dbStrings, pool } = require('./src/models/index.js');
console.log(dbStrings['userModel'])
pool.connect().then((client) => {
    client.query(dbStrings['userModel'], (err, res) => {
        console.log(err, res)
        console.log('Connected to the database');
        client.release();
    })
});


app.use(express.json());  // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For URL-encoded bodies
// app.use(express.static('public')); // For serving static files
//connect routes from routes folder
app.set('port', 3000);
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.post('/signup',
    async (req, res) => {
        await controllers.signup(req, res)
    }
);
app.get('/login', function (req, res) {
    res.send('Login Page');
});
app.get('/forgot-password', function (req, res) {
    res.send('Forgot Password Page');
}
);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });