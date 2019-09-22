var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//comments New
router.get('/posts/:id/comments/new', middleware.isLoggedIn, function(req, res){
    //find post by id
    Post.findById(req.params.id, function(err, foundPost){
        if (err || !foundPost) {
            req.flash('error', 'Post not found');
            res.redirect('/posts');
        } else {
            res.render('comments/new', {post: foundPost});
        }
    });
    
});

//Comments Create
router.post('/posts/:id/comments', middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            console.log(err);
            res.redirect('/posts');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    req.flash('error', "Error creating comment");
                    console.log(err);
                } else {
                    //add id and username to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    //push the comment in post
                    foundPost.comments.push(comment);
                    foundPost.save();
                    req.flash('success', "Comment added");
                    res.redirect('/posts/' + foundPost._id);
                }
            })
        }
    });
});

//Comment EDIT route
router.get('/posts/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    
    //at first we need to find the post
    Post.findById(req.params.id, function(err, foundPost){
        if (err || !foundPost) {
            req.flash('error', 'Post not found');
            return res.redirect('back');
        } else {
            //if there is no error , we find the comment and render edit form
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if (err) {
                    res.redirect('back');
                } else {
                    res.render('comments/edit', { post: foundPost, comment: foundComment});
                }
            });
        }
    });    
    //res.send('comments/edit');
});

//comment UPDATE
router.put('/posts/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/posts/' + req.params.id);
        }
    });
});

//Comment DELETE
router.delete('/posts/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment Deleted');
            res.redirect('/posts/' + req.params.id);
        }
    });
});



module.exports = router;