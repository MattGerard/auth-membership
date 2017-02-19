const express = require('express');
const router = express.Router();
const authHelpers = require('../auth/_helpers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user});
});

router.get('/account', authHelpers.loginRequired, (req, res, next)  => {
  res.render('user/account', { title: 'My Account', user: req.user});
});

module.exports = router;
