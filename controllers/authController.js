const Post = require('../models/post');
const Comment = require('../models/comment');

exports.checkPostOwnership = async (req, res, next) => {
  try {
    const foundPost = await Post.findById(req.params.id);
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
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/posts');
  }
};

exports.checkCommentOwnership = async (req, res, next) => {
  //user is the author of the comment
  //foundComment.author.id  is a mongoose obj
  //req.user._id  is a string
  try {
    const foundComment = await Comment.findById(req.params.comment_id);
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
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/posts');
  }
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to login first');
  res.redirect('/login');
};
