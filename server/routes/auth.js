const express = require('express');
const router = express.Router();

const authHelpers = require('../auth/_helpers');
// const passport = require('../auth/local');
const passport = require('../auth/twitch');

function handleLogin(req, user) {
  return new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}

/* PASSPORT REGISTER. */

router.post('/register', authHelpers.loginRedirect, (req, res, next)  => {
  return authHelpers.createUser(req, res)
  .then((response) => {
    passport.authenticate('local', (err, user, info) => {
      if (user) { handleResponse(res, 200, 'success'); }
    })(req, res, next);
  })
  .catch((err) => { handleResponse(res, 500, 'error'); });
});

router.get('/register', (req, res) => {
  res.render('register', { message: req.flash('error') });
});

/* PASSPORT LOGIN. */
router.post('/login', authHelpers.loginRedirect, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { handleResponse(res, 500, 'error'); }
    if (!user) { handleResponse(res, 404, 'User not found'); }
    if (user) { handleResponse(res, 200, 'success'); }
  })(req, res, next);
});

router.get('/login', (req, res) => {
  if(req.user){
    res.redirect('/account');
  } else {
    res.render('login', { message: req.flash('error')});
  }
  
});

/* PASSPORT LOGOUT. */
router.get('/logout', authHelpers.loginRequired, (req, res, next) => {
  req.logout();
  res.redirect('/');
  // handleResponse(res, 200, 'success');
});

/* PASSPORT TWITCH. */
router.get('/twitch', passport.authenticate('twitch', { scope: ['user_read'] }));

router.get('/twitch/callback',
    passport.authenticate('twitch'), (req, res, next) => {
      res.redirect(req.session.returnTo || '/auth/login');
    }
);


module.exports = router;