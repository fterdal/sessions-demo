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
app.get('/', (req, res, next) => {
  console.log('Session:', req.session);
  console.log('Session ID:', req.session.id);
  console.log('Headers: ', req.headers);
  console.log('Cookie: ', req.headers.cookie);
  res.send(`
  <h1>Hello</h1>
  `);
});
const PORT = 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
