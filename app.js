
const { urlencoded } = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
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
    password: String,
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://lightwars.herokuapp.com/auth/google/secrets',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({
            googleId: profile.id,
            username: profile.emails[0].value
        }, (err, user) => {
            return cb(err, user);
        });
    }
));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

app.get('/auth/google/secrets',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/secrets');
    }
);

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
      User.find({ secret: { $ne: null } }, function (err, foundUsers) {
        if (err) {
          console.log(err);
        } else {
          if (foundUsers) {
            res.render('secrets', { usersWithSecrets: foundUsers });
          }
        }
      });
    } else {
      res.redirect('/login');
    }
});

app.get('/submit', (req, res) => {
    if(req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect('/login');
    }
});

app.post('/submit', (req, res) => {
    const submittedSecret = req.body.secret;

    User.findById(req.user.id, (err, foundUser) => {
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(() => {
                    res.redirect('/secrets');
                });
            }
        }
    });
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
            res.redirect('/login');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets');
            });
        }
    });
});

// Can listen on Heroku or local
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on Port 3000.");
});