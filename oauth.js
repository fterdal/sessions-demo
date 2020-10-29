const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { createOrCreateUser } = require('./users');

// /oauth/google
router.get('/google', passport.authenticate('google', { scope: 'email' }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/yayitworked',
    failureRedirect: '/didntwork',
  })
);


// NEVER send any client secrets to GitHub like this. The only reason I'm doing this
// here is because I created these credentials right before the code demo, and deleted them right afterwards.
// Instead, consider utilizing the "process environment" to set/retrieve private secrets like this one.
// Check out this article for some additional information: https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '720195130792-g1v8ddu9701udlt40n9bdeuc1ve1v2c5.apps.googleusercontent.com',
      clientSecret: 'U3tJHyp6Cgbfx3_O7q4P07LZ',
      callbackURL: 'https://1bda78c88cee.ngrok.io/oauth/google/callback',
    },
    // Google will send back the token and profile
    (token, refreshToken, profile, done) => {
      console.log({ token, refreshToken, profile });
      const user = createOrCreateUser({
        id: profile.id,
        email: profile._json.email,
        picture: profile._json.picture,
      });
      console.log('USER', user);
      done(null, user);
    }
  )
);

module.exports = router;
