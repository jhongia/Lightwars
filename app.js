
const { urlencoded } = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const saltRounds = 10;

const app = express();
const username = process.env.USERNAME;
const password = process.env.PASS;
const address = process.env.ADDRESS;
const secret = process.env.SECRET;
const sessionSecret = process.env.LITSECRET;

app.use(urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb+srv://' + username + ':' + password + '@' + address + '.mongodb.net/usersDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/secrets', (req, res) => {
    if(req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

app.post('/register', (req, res) => {

   User.register({username: req.body.username}, req.body.password, (err, user) => {
    if(err) {
        console.log(err);
        res.redirect('register');
    } else {
        passport.authenticate('local')(req, res, () => {
            res.redirect('/secrets');
        });
    }
   });
});

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets');
            });
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