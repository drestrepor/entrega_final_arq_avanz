const express = require('express')
const session = require('express-session')
const passport = require('passport')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();

const app = express();

function isLoggedIn(req, res, next) {
	req.user ? next() : res.sendStatus(401);
}

function isNotLoggedIn(req, res, next) {
	!req.user ? next() : res.redirect('/auth/google');
}

app.use(session({ secret: 'david', resave: true, saveUninitialized: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(
	new GoogleStrategy(
		{
			clientID: `${process.env.GOOGLE_CLIENT_ID}`,
			clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
			callbackURL: `${process.env.DOMAIN}/google/callback`,
			passReqToCallback: true,
		},
		(request, accessToken, refreshToken, profile, done) => {
			console.log(`user ${profile.id} is logging now!`);
			return done(null, profile);
		}
	)
);

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: `${process.env.DOMAIN}/`,
		failureRedirect: '/auth/google/failure',
	})
);

app.get('/auth/profile', isLoggedIn, (req, res) => {
	const user = req.user;
	res.status(200).json({
		id: user.id,
		email: user.email,
		photo: user.picture,
	});
});

app.get('/auth/google/failure', isNotLoggedIn, (req, res) => {
	res.status(400).json({ message: 'Failed to authenticate' });
});

app.get('/auth/logout', (req, res) => {
	req.logout({}, err => console.log(err));
	req.session.destroy(err => {
        res.clearCookie('connect.sid');
        console.log(err);
        res.status(200).send({ message: 'You are now logged out!' });
    });
});

app.listen(5000, () => console.log('Listening on port 5000'));