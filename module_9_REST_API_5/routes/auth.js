const express = require('express');

const {body} = require('express-validator');

const User = require('../models/User');

const authController = require('../controller/auth');

const router = express.Router();

router.post('/signup',[
    body('email').isEmail().withMessage('Please enter a valid email.')
    .custom(value => {
        return User.findOne({email:value})
        .then(user => {
            if (user) {
                return Promise.reject('Email already exists.');
            }
        })
        .catch(err => {
            throw err;
        })
    })
    .normalizeEmail(),
    body('name').trim().not().isEmpty(),
    body('password').trim().isLength({min:8})
],authController.signup);

module.exports = router;