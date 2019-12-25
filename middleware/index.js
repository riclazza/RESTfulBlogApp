var middlewareObj = {};
var Post = require('../models/post');
var Comment = require('../models/comment');

middlewareObj.checkPostOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Post.findById(req.params.id, function(err, foundPost) {
      if (err || !foundPost) {
        req.flash('error', 'Post not found');
        res.redirect('back');
      } else {
        //user is the author of the post
        //foundPost.author.id  is a mongoose obj
        //req.user._id  is a string
        if (foundPost.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to login first');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        //user is the author of the comment
        //foundComment.author.id  is a mongoose obj
        //req.user._id  is a string
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to login first');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to login first');
  res.redirect('/login');
};

module.exports = middlewareObj;
