const express = require('express');

const router = express.Router();

const Post = require('../models/post');
const Comment = require('../models/comment');
const authController = require('../controllers/authController');

//comments New
router.get('/posts/:id/comments/new', authController.isLoggedIn, (req, res) => {
  //find post by id
  Post.findById(req.params.id, (err, foundPost) => {
    if (err || !foundPost) {
      req.flash('error', 'Post not found');
      res.redirect('/posts');
    } else {
      res.render('comments/new', { post: foundPost });
    }
  });
});

//Comments Create
router.post('/posts/:id/comments', authController.isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('/posts');
    } else {
      Comment.create(req.body.comment, (error, comment) => {
        if (error) {
          req.flash('error', 'Error creating comment');
        } else {
          //add id and username to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save the comment
          comment.save();
          //push the comment in post
          foundPost.comments.push(comment);
          foundPost.save();
          req.flash('success', 'Comment added');
          res.redirect(`/posts/${foundPost._id}`);
        }
      });
    }
  });
});

//Comment EDIT route
router.get(
  '/posts/:id/comments/:comment_id/edit',
  authController.isLoggedIn,
  authController.checkCommentOwnership,
  (req, res) => {
    //at first we need to find the post
    Post.findById(req.params.id, (err, foundPost) => {
      if (err || !foundPost) {
        req.flash('error', 'Post not found');
        return res.redirect('back');
      }
      //if there is no error , we find the comment and render edit form
      Comment.findById(req.params.comment_id, (error, foundComment) => {
        if (error) {
          res.redirect('back');
        } else {
          res.render('comments/edit', {
            post: foundPost,
            comment: foundComment
          });
        }
      });
    });
    //res.send('comments/edit');
  }
);

//comment UPDATE
router.put(
  '/posts/:id/comments/:comment_id',
  authController.isLoggedIn,
  authController.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      (err, updatedComment) => {
        if (err) {
          res.redirect('back');
        } else {
          req.flash(
            'success',
            `Comment updated by ${updatedComment.author.username}`
          );
          res.redirect(`/posts/${req.params.id}`);
        }
      }
    );
  }
);

//Comment DELETE
router.delete(
  '/posts/:id/comments/:comment_id',
  authController.isLoggedIn,
  authController.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, err => {
      if (err) {
        res.redirect('back');
      } else {
        req.flash('success', 'Comment Deleted');
        res.redirect(`/posts/${req.params.id}`);
      }
    });
  }
);

module.exports = router;
