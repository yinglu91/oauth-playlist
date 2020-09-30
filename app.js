require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const pool = require('./database/db');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const passport = require('passport');

const app = express();

// set up view engine
app.set('view engine', 'ejs');

// enscript cookie once login
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // 1day
    keys: [keys.session.cookieKey], // encript cookie
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session()); // use session cookie to login
// Cookie: express:sess=eyJwYXNzcG9ydCI6eyJ1c2VyIjoxfX0=; express:sess.sig=7i0wBNZmhwQf_KBVukFGHzX9qF4

// after logout
// Cookie: express:sess=eyJwYXNzcG9ydCI6e319; express:sess.sig=bOX5vmEugH0EpjVSwdAnBOdF4R0

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home rout
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app now listneing for requests on port ${port}`);
});

// https://github.com/iamshaunjp/oauth-playlist/tree/lesson-4/views
