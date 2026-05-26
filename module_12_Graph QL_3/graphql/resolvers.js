const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async function(args, req) {
        // const email = args.userInput.email;
        const userInput = args.userInput;
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({message: 'E-mail is invalid!'});
        }
        if (validator.isEmpty(userInput.password) || 
            !validator.isLength(userInput.password, {min: 5})
        ) {
            errors.push({message: 'Password too short!'});
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input!');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const exitingUser = await User.findOne({email: userInput.email})
        if (exitingUser) {
            const error = new Error('User exists already!');
            throw error;
        }
        const hashedPassword = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPassword
        });
        const createUser =  await user.save();
        return {
            ...createUser._doc,
            _id: createUser._id.toString()
        };
    },

    Login: async function({email, password}) {
        const user = await User.findOne({email: email});
        if (!user) {
            const error = new Error('User not found!');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Incorrect password!');
            error.code = 401;
            throw error;
        }
        const token = jwt.sign(
            {userId: user._id.toString(), email: user.email},
            'somesupersecretkey',
            {expiresIn: '1h'}
        );
        return {
            token: token,
            userId: user._id.toString()
        };
    },
    createPost: async function({postInput}, req) {
        const errors = [];
        if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, {min: 5})) {
            errors.push({message: 'Title is too short!'});
        }
        if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, {min: 5})) {
            errors.push({message: 'Content is too short!'});
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input!');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const post = await new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
        })
        const createdPost = await post.save();
        // Add post to the creator
        return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString(),
            updatedAt: createdPost.updatedAt.toISOString()
        };
    }

}