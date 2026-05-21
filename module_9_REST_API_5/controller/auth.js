
const User = require('../models/User');

const {ValidationResult} = require('express-validator');

const bcrypt = require('bcryptjs');

exports.signup = (req,res,next) => {
    const err = ValidationResult(req);
    if (!err.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = err.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
    .then(hassedPw => {
        const user = new User({
            email: email,
            name: name,
            password: hassedPw
        });
        return user.save()
    })
    .then(result => {
        res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
    const user = new User({
        email: email,
        name: name,
        password: password
    })
}