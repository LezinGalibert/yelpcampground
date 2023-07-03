if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const campgroundRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');
const UserRouter = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Create app with express
const app = express();

// Mongoose boilerplate ======>
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// <==========

// Express boilerplate
app.engine('ejs', engine); // EJS mate for partials
app.set('view engine', 'ejs'); // Use EJS engine
app.set('views', path.join(__dirname, 'views')); // Set the view directory to cwd

// Express middleware boilerplate
app.use(express.urlencoded({ extended: true })); // URL encoded method for parsing requests
app.use(methodOverride('_method')); // Override POST methods with PUT, DELETE, etc.
app.use(express.static(path.join(__dirname, 'public'))); // Include the public static directory in our views

// Session and Cookie configuration ======>
const sessionConfig = {
  secret: 'sosecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 24 * 3600 * 1000,
    maxAge: 24 * 3600 * 1000,
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session()); //For persistent login sessions, needs to be placed AFTER session

// <=========

// Authentication settup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware for "flashing" elements referenced in the req.flash object ====>
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// <===========

// Router Settup
app.use('/', UserRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewsRouter); // requires "merge-params" option set to true in the Review router file

// Basic app routes
app.get('/', (_, res) => {
  res.render('home.ejs');
});

// Fallback error when the route is not referenced
app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

// Middleware fallback for error handling
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = 'Oops something went wrong...';
  }
  res.status(status).render('error', { err });
});

// Opens and listen to port 3000 on localhost
app.listen(3000, () => {
  console.log('Serving on port 3000');
});
