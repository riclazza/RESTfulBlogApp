const Post = require('../models/post');
const Comment = require('../models/comment');

exports.checkPostOwnership = (req, res, next) => {
  const foundPost = Post.findById(req.params.id);
  if (!foundPost) {
    req.flash('error', 'Post not found');
    res.redirect('back');
  }
  if (foundPost.author.id.equals(req.user._id)) {
    next();
  } else {
    req.flash('error', "You don't have permission to do that");
    res.redirect('back');
  }
};

exports.checkCommentOwnership = (req, res, next) => {
  //user is the author of the comment
  //foundComment.author.id  is a mongoose obj
  //req.user._id  is a string
  const foundComment = Comment.findById(req.params.comment_id);
  if (!foundComment) {
    req.flash('error', 'Comment not found');
    res.redirect('back');
  }
  if (foundComment.author.id.equals(req.user._id)) {
    next();
  } else {
    req.flash('error', "You don't have permission to do that");
    res.redirect('back');
  }
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to login first');
  res.redirect('/login');
};
