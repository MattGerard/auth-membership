const bcrypt = require('bcryptjs');
const knex = require('../db/knex');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser(profile) {
  console.log(profile, 'profile inside create')
    return knex('users')
    .insert({
      username: profile.displayName,
      email: profile.email
    })
    .returning('*');
    return;
}

function createAccountClaim(uid, pid, accessToken, refreshToken, provider) {
  return knex('claim_types').where({
    name: provider,
  }).first().then((res) => {
      console.log(res, pid, 'were inside RES HERE');
      const providerId = res.id;
      return knex('claims')
      .insert({
        type_id: providerId,
        user_id: uid,
        provider_id: pid,
        auth_token: accessToken,
        refresh_token: refreshToken
      })
      .returning('*');
  })
  .catch((err) => { console.log(err, 'SHJIASDFASD') });
  return;
}

function loginRequired(req, res, next) {
  req.session.returnTo = req.path;
  if (!req.user) return  res.redirect('/auth/login/');
  return next();
}

function adminRequired(req, res, next) {
  if (!req.user) res.status(401).json({status: 'Please log in'});
  return knex('users').where({username: req.user.username}).first()
  .then((user) => {
    if (!user.admin) res.status(401).json({status: 'You are not authorized'});
    return next();
  })
  .catch((err) => {
    res.status(500).json({status: 'Something bad happened'});
  });
}

function loginRedirect(req, res, next) {
  if (req.user) return res.status(401).json(
    {status: 'You are already logged in'});
  return next();
}

function handleErrors(req) {
  return new Promise((resolve, reject) => {
    if (req.body.username.length < 6) {
      reject({
        message: 'Username must be longer than 6 characters'
      });
    }
    else if (req.body.password.length < 6) {
      reject({
        message: 'Password must be longer than 6 characters'
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  comparePass,
  createUser,
  createAccountClaim,
  loginRequired,
  adminRequired,
  loginRedirect,
  handleErrors
};