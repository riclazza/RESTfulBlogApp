const express = require('express'),
  bodyParser = require('body-parser'),
  expressSanitizer = require('express-sanitizer'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  User = require('./models/user'),
  methodOverride = require('method-override'),
  rateLimit = require('express-rate-limit'),
  helmet = require('helmet'),
  mongoSanitize = require('express-mongo-sanitize'),
  xss = require('xss-clean');

const dotenv = require('dotenv');

const commentRoutes = require('./routes/comments'),
  postsRoutes = require('./routes/posts'),
  authRoutes = require('./routes/auth');

const app = express();

dotenv.config({ path: './config.env' });

// Global MIDDLEWARES
//set security http headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //100 requests in 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());

//==================PASSPORT============================

app.use(
  require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  //user must be passed to all headers
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(authRoutes);
app.use(postsRoutes);
app.use(commentRoutes);

module.exports = app;
