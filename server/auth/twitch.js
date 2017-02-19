const passport = require('passport');
const twitchStrategy = require('passport-twitch').Strategy;
const authHelpers = require('./_helpers');
const init = require('./passport');
const knex = require('../db/knex');
const dotenv = require('dotenv/config');

const options = {};

init();

passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENTID,
    clientSecret: process.env.TWITCH_SECRET,
    callbackURL: process.env.TWITCH_CALLBACK,
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('we hit twitch', accessToken, refreshToken, profile, done)
    // User.findOrCreate({ twitchId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    //select * from users u left join claims c on c.user_id = u.id inner join claim_types ct on ct.id = c.type_id where ct.name = 'twitch'
 
    //Check if user exists by EMAIL:
    //If no user exists, create user with email and use username from service
    //After User Created Create Claim to service ID
 
  // return knex('users').where({email: profile.email}).first()
    // return knex.select('*').from('users').leftJoin('claims', 'users.uid', 'claims.user_id').innerJoin('claim_types', 'users.id', 'claim_types.name').where('claim_types.name', 'TWITCH')
  return knex.select('*').from('users').leftJoin('claims', 'users.uid', 'claims.user_id').innerJoin('claim_types', 'type_id', 'claim_types.id').where('claim_types.name', 'TWITCH').first()
  .then((user) => {
    console.log(user, 'were looking for user inside users')
    if (!user || user.length <= 0) {
      console.log('there was no user')
      return authHelpers.createUser(profile)
      .then((response) => {
        console.log(response, 'whats in the box??')
          return authHelpers.createAccountClaim(response[0].uid, profile.id, accessToken, refreshToken, 'TWITCH')
          .then((response) => {
            console.log(response, 'whats in the BIG box??')
            return done(null, user);
          })
          .catch((err) => { console.log(err) });
      })
      .catch((err) => { console.log(err) });
    };
    return done(null, user);
  })
  .catch((err) => { console.log(err) });

    
//   return authHelpers.createUser(req, res)
//   .then((response) => {

//   })
//   .catch((err) => { handleResponse(res, 500, 'error'); });

  }
));

module.exports = passport;