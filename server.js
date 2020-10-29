const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const oauthRouter = require('./oauth');
const { findUserById } = require('./users');

const app = express();

app.use(morgan('dev'));

app.use(
  session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: '2009-FSA-RM is cool', // or whatever you like
    // this option says if you haven't changed anything, don't resave. It is recommended and reduces session concurrency issues
    resave: false,
    // this option says if I am new but not modified still save
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = findUserById(id);
  done(null, user);
});

// Homepage
app.get('/', (req, res, next) => {
  res.send(`<div>
      <nav>
        <a href="/login">Login</a>
      </nav>
      <h1>Home Page</h1>
    </div>`);
});

// Login Page
app.get('/login', (req, res, next) => {
  res.send(`<form method="get" action="/oauth/google">
    <button type="submit">Login with Google</button>
  </form>`);
});

// Login Error Page
app.get('/didntwork', (req, res, next) => {
  res.send(`
    <h1>It didn't work 😞</h1>
    <div>req.user = ${JSON.stringify(req.user)}</div>
  `);
});

// Login Success Page
app.get('/yayitworked', (req, res, next) => {
  console.log(req.user);
  res.send(`
    <h1>It worked 🎉</h1>
    <div>req.user = ${JSON.stringify(req.user)}</div>
    <div>Email: ${req.user ? req.user.email : 'None'}</div>
    <img src="${req.user ? req.user.picture : ''}" />
  `);
});

// Apply Custom OAuth Middleware
app.use('/oauth', oauthRouter);

const PORT = 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
