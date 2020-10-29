const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { createOrCreateUser } = require('./users');

router.get('/google', passport.authenticate('google', { scope: 'email' }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/yayitworked',
    failureRedirect: '/didntwork',
  })
);

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
