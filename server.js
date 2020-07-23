const express = require('express');
const session = require('express-session');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.use(
  session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: 'i want a smoothie so bad rn', // or whatever you like
    // this option says if you haven't changed anything, don't resave. It is recommended and reduces session concurrency issues
    resave: false,
    // this option says if I am new but not modified still save
    saveUninitialized: true,
  })
);

let globalCounter = 1;

app.get('/', (req, res, next) => {
  console.log('Session:', req.session);
  console.log('Session ID:', req.session.id);
  console.log('Headers: ', req.headers);
  console.log('Cookie: ', req.headers.cookie);
  globalCounter++;

  // if (req.headers.cookie) {
  //   req.headers.cookie.value.favoriteDessert = 'mango sticky rice';
  // }

  if (req.session.counter) {
    req.session.counter++;
  } else {
    req.session.counter = 1;
  }

  if (req.session.user) {
    req.session.user = {
      id: req.session.user.id+1,
      email: 'someemail@mysite.com',
    };
  } else {
    req.session.user = {
      id: 1,
      email: 'someemail@mysite.com'
    }
  }
  if (req.session.user.id > 10) {
    delete req.session.user;
  }

  res.send(`
  <style>
    p.cookie {
      font-size: ${req.session.counter}px;
    }
    p.ice-cream {
      font-size: ${globalCounter}px;
    }

  </style>
  <h1>Hello</h1>
  <div>
    <div>Your Session ID = ${req.session.id}</div>
    <p class="cookie">🍪</p>
    <p class="ice-cream">🥭🍨</p>
  </div>
  `);
});
const PORT = 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
