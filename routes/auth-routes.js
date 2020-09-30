const router = require('express').Router(); // instance of Router
const passport = require('passport');

// auth login - section 4
router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
  // handle with pw
  req.logout(); // rm session
  res.redirect('/');
});

// auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
);

// callback rout for google to redirect to, this time, has code, middleware then fire pw cb functin before this end function
router.get('/google/redirct', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile/');
});

module.exports = router;
