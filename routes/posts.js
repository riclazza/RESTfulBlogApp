var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//Root route
router.get('/', function(req, res){
    res.redirect('/posts');
});


//INDEX route
router.get('/posts', function(req, res){
    //find every post in database
    Post.find({}, function(err, allPosts){
        if(err){
            console.log("ERROR");
        } else {
            res.render('posts/index', {posts: allPosts});
        }
    })
});

//NEW route
router.get('/posts/new', middleware.isLoggedIn, function(req, res){
    res.render('posts/new');
});

//CREATE route
router.post('/posts', middleware.isLoggedIn, function(req, res){
    //sanitize the input
    req.body.post.body = req.sanitize(req.body.post.body);
    //take the author and put it in the Post
    req.body.post.author = {
        id: req.user._id,
        username: req.user.username
    }
    //create Post
    Post.create(req.body.post, function(err, newPost){
        if (err) {
            res.render('posts/new');
        } else {
            //redirect to index
            res.redirect('/posts');
        }    
    });  
});

//SHOW route
router.get('/posts/:id', function(req, res){
    Post.findById(req.params.id).populate('comments').exec(function(err, foundPost){
        if (err || !foundPost) { //check also if foundPost is null. !null is true
            req.flash('error', 'Post not found');
            res.redirect('/posts');
        } else {
            res.render('posts/show', {post: foundPost});
        }
    });
    
});

//EDIT route
router.get('/posts/:id/edit', middleware.checkPostOwnership, function(req, res){
    //checking if user is logged 
    Post.findById(req.params.id, function(err, foundPost){
        res.render('posts/edit', {post: foundPost});
    });
   
    
});

//UPDATE route
router.put('/posts/:id', middleware.checkPostOwnership, function(req, res){

    req.body.post.body = req.sanitize(req.body.post.body);

    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if (err) {
            res.redirect('/posts');
        } else {
            res.redirect('/posts/' + req.params.id);
        }
    });
});


//DELETE route
router.delete('/posts/:id', middleware.checkPostOwnership, function(req, res){
    //destroy Post and redirect 
    Post.findByIdAndRemove(req.params.id, function(err, removedPost){
        if (err) {
            console.log(err);
        }
        //delete all the comments related to the post that we are removing
        Comment.deleteMany( {_id: { $in: removedPost.comments} }, function(err){
            if (err) {
                console.log(err);
            }
        });
        res.redirect('/posts');
        
    });
});



module.exports = router;