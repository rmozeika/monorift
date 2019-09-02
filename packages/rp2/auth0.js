const Auth0Strategy = require('passport-auth0'),
    passport = require('passport');
    
const config = require('./conf')
const api = require('./api.js');
const { clientID, clientSecret, domain, callbackURL } = config;
//passport-auth0
const strategy = new Auth0Strategy({
  domain,
  clientID,
  clientSecret,
  callbackURL
 },
 function(accessToken, refreshToken, extraParams, profile, done) {
   // accessToken is the token to call Auth0 API (not needed in the most cases)
   // extraParams.id_token has the JSON Web Token
   // profile has all the information from the user
    const users = api.repositories['users'];
    users.findOne({ username: profile.nickname }, (err, user) => {
        if (!user) {
            users.importProfile(profile, (err, res) => {
              return done(null, profile);
            });
            //return done(null, profile)
        } else {
          return done(null, profile)
        }
      })
 }
);

passport.use(strategy);

//app.js
passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


module.exports = passport