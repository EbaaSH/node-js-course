const {validationResult} = require('express-validator');
const Post = require('../models/Post');
exports.getPosts = (req,res,next) => {
    Post.find().then(posts => {
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: posts
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
    
};

exports.createPost = (req,res,next) => {
    const errors = validationResult(req);
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    if(!errors.isEmpty()){
        throw error;
    }
    title = req.body.title;
    content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/download.jpg',
        creator: {name: 'EBAA'},
    });
    post.save().then(result=>{
        console.log(result);
        res.status(201).json({
        message: 'Post created successfully!',
        post: result
    });
    }).catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    
};

exports.getPost = (req,res,next) => {
    const postId = req.params.postId;
    Post.findById(postId).then(post=>{
        if(!post){
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({message: 'Post fetched.', post: post});
    }).catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}