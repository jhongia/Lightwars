
const { urlencoded } = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const encrypt = require('mongoose-encryption');
const passport = require('passport');

const app = express();
const username = process.env.USERNAME;
const password = process.env.PASS;
const address = process.env.ADDRESS;

app.use(urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://' + username + ':' + password + '@' + address + '.mongodb.net/usersDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render('secrets');
        }
    });

});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if (!foundUser) {
            console.log('User not found in database.');
            res.render('login');
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});