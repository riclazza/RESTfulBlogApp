const express = require('express');

const router = express.Router();

const Post = require('../models/post');
const Comment = require('../models/comment');
const authController = require('../controllers/authController');

//Root route
router.get('/', function(req, res) {
  res.redirect('/posts');
});

//INDEX route
router.get('/posts', (req, res) => {
  //find every post in database
  Post.find({}, (err, allPosts) => {
    if (err) {
      req.flash('error', 'Posts are not found');
    } else {
      res.render('posts/index', { posts: allPosts });
    }
  });
});

//NEW route
router.get('/posts/new', authController.isLoggedIn, (req, res) => {
  res.render('posts/new');
});

//CREATE route
router.post('/posts', authController.isLoggedIn, (req, res) => {
  //sanitize the input
  req.body.post.body = req.sanitize(req.body.post.body);
  //take the author and put it in the Post
  req.body.post.author = {
    id: req.user._id,
    username: req.user.username
  };
  //create Post
  Post.create(req.body.post, err => {
    if (err) {
      res.render('posts/new');
    } else {
      //redirect to index
      res.redirect('/posts');
    }
  });
});

//SHOW route
router.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundPost) {
      if (err || !foundPost) {
        //check also if foundPost is null
        req.flash('error', 'Post not found');
        res.redirect('/posts');
      } else {
        res.render('posts/show', { post: foundPost });
      }
    });
});

//EDIT route
router.get(
  '/posts/:id/edit',
  authController.isLoggedIn,
  authController.checkPostOwnership,
  function(req, res) {
    Post.findById(req.params.id, (err, foundPost) => {
      res.render('posts/edit', { post: foundPost });
    });
  }
);

//UPDATE route
router.put(
  '/posts/:id',
  authController.isLoggedIn,
  authController.checkPostOwnership,
  function(req, res) {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedPost) => {
      if (err) {
        res.redirect('/posts');
      } else {
        res.redirect(`/posts/${updatedPost._id}`);
      }
    });
  }
);

//DELETE route
router.delete(
  '/posts/:id',
  authController.isLoggedIn,
  authController.checkPostOwnership,
  function(req, res) {
    //destroy Post and redirect
    Post.findByIdAndRemove(req.params.id, (err, removedPost) => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('/posts');
      }
      //delete all the comments related to the post that we are removing
      Comment.deleteMany({ _id: { $in: removedPost.comments } }, error => {
        if (error) {
          req.flash('error', err.message);
        }
      });
      res.redirect('/posts');
    });
  }
);

module.exports = router;
