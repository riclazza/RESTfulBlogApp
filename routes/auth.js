var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');


//=====AUTH ROUTES========


//show register form
router.get('/register', function(req, res){
    res.render('register');
});

//sign up
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome '+ user.username);
            res.redirect('/posts');
        });
    });
});


//LOGIN 
router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', passport.authenticate('local',
    {
        failureRedirect: '/login',
        failureFlash: true
    }), function(req, res){
        req.flash('success', 'Welcome '+ req.body.username);
        res.redirect('/posts');
});

//LOGOUT
router.get('/logout', function(req, res){
    req.logOut();
    req.flash('success', 'Successfully Logged Out')
    res.redirect('/posts');
});


module.exports = router;