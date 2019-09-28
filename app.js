var express = require('express'),
    bodyParser = require('body-parser'),
    expressSanitizer = require('express-sanitizer'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    methodOverride = require('method-override');

var commentRoutes = require('./routes/comments'),
    postsRoutes = require('./routes/posts'),
    authRoutes = require('./routes/auth');

var app = express();    

var PORT = 8080;

require('dotenv').config();

//This will connecto to the mongo service created by docker-compose 
//If mongo service is running on the local machine , use localhost:27017 instead of mongo:27017
mongoose.connect('mongodb://mongo:27017/restful_blog_app', { useNewUrlParser: true});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());

//==================PASSPORT============================

app.use(require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ //user must be passed to all headers
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(authRoutes);
app.use(postsRoutes);
app.use(commentRoutes);



app.listen(process.env.PORT || PORT, function(){   
    console.log("server is running on port " + PORT);
});

