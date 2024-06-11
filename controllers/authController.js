const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { secret, expiresIn } = require('./jwt'); // Adjust path if necessary
const hashPassword = require('../utils/hashPassword');
const { sendResponse } = require('../utils/responseHelper');
const Joi = require('joi');

// Validation schema for user registration
const registerSchema = Joi.object({
    fname: Joi.string().required(),
    lname: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string(),
    address: Joi.string(),
    gender: Joi.string(),
    dob: Joi.date(),
    username: Joi.string().required(),
    password: Joi.string().required(),
});

// Validation schema for user login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

exports.register = async (req, res) => {
    try {
        // Validate request body
        const { error } = registerSchema.validate(req.body);
        if (error) return sendResponse(res, 400, error.details[0].message);

        // Check if user already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) return sendResponse(res, 400, 'User already exists');

        // Hash password
        const hashedPassword = await hashPassword(req.body.password);

        // Create new user
        user = new User({ ...req.body, password: hashedPassword });
        await user.save();

        // Create payload without password for response
        const userData = {
            id: user.id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            username: user.username,
            isadmin: user.isadmin,
        };

        // Generate JWT token
        const payload = { user: { id: user.id, isadmin: user.isadmin } };
        jwt.sign(payload, secret, { expiresIn }, (err, token) => {
            if (err) throw err;
            sendResponse(res, 200, 'User registered successfully', { token, user: userData });
        });
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.login = async (req, res) => {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) return sendResponse(res, 400, error.details[0].message);

        // Find user by email
        let user = await User.findOne({ email: req.body.email });
        if (!user) return sendResponse(res, 400, 'Invalid credentials');

        // Compare passwords
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return sendResponse(res, 400, 'Invalid credentials');

        // Create payload without password for response
        const userData = {
            id: user.id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            username: user.username,
            isadmin: user.isadmin,
        };

        // Generate JWT token
        const payload = { user: { id: user.id, isadmin: user.isadmin } };
        jwt.sign(payload, secret, { expiresIn }, (err, token) => {
            if (err) throw err;
            sendResponse(res, 200, 'Login successful', { token, user: userData });
        });
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};