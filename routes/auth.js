const express = require('express');

const router = express.Router();

const passport = require('passport');
const User = require('../models/user');

//=====AUTH ROUTES========

//show register form
router.get('/register', (req, res) => {
  res.render('register');
});

//sign up
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome ${user.username}`);
      res.redirect('/posts');
    });
  });
});

//LOGIN
router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    req.flash('success', `Welcome ${req.body.username}`);
    res.redirect('/posts');
  }
);

//LOGOUT
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'Successfully Logged Out');
  res.redirect('/posts');
});

module.exports = router;
