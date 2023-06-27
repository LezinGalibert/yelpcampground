const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const campgroundRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');


const app = express();

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

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'sosecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 3600 * 1000,
    maxAge: 3600 * 1000,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewsRouter);

app.get('/', (_, res) => {
    res.render('home.ejs');
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
  const { status = 500 } = err;

  if (!err.message) {
    err.message = 'Oops something went wrong...';
  }
  res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
    }
);




