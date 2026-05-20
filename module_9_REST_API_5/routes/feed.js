const express = require('express');
// isntall it with npm install express-validator
const {body} = require('express-validator');

const feedController = require('../controller/feed');

const router = express.Router();

router.get('/posts',feedController.getPosts);

router.post('/post',[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
],feedController.createPost);
module.exports = router;

router.get('/post/:postId',feedController.getPost);
