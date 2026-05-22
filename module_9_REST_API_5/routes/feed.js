const express = require('express');
// install it with npm install express-validator
const {body} = require('express-validator');

const feedController = require('../controller/feed.js');

const isAuth = require('../middleware/is-atuh.js');

const router = express.Router();

router.get('/posts',isAuth,feedController.getPosts);

router.post('/post',isAuth, [
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
],feedController.createPost);
module.exports = router;

router.get('/post/:postId',isAuth,feedController.getPost);

router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
],feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);