const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { createOrCreateUser } = require('./users')

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
        process.env.GOOGLE_CLIENT_ID || 'nope',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'not gonna work',
      callbackURL: 'http://localhost:8080/oauth/google/callback',
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
