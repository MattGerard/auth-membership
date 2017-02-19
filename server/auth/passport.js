const passport = require('passport');
const knex = require('../db/knex');

module.exports = () => {

  // passport.serializeUser((user, done) => {
  //   done(null, user.uid);
  // });

  // passport.deserializeUser((uid, done) => {
  //   knex('users').where({uid}).first()
  //   .then((user) => { done(null, user); })
  //   .catch((err) => { done(err,null); });
  // });

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

};