const User = require('../models/User');
const { sendResponse } = require('../utils/responseHelper');

exports.getUsers = async (req, res) => {
    try {
        let users = await User.find().lean();  // Fetch users as plain JavaScript objects
        users = users.map(user => {
            delete user.password;  // Remove password field
            return user;
        });
        sendResponse(res, 200, 'Users retrieved successfully', users);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').lean();
        if (!user) return sendResponse(res, 404, 'User not found');
        sendResponse(res, 200, 'User retrieved successfully', user);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.updateUser = async (req, res) => {
    const { fname, lname, email, mobile, address, gender, dob, username } = req.body;
    const updatedUser = { fname, lname, email, mobile, address, gender, dob, username };

    try {
        const user = await User.findByIdAndUpdate(req.params.id, updatedUser, { new: true });
        if (!user) return sendResponse(res, 404, 'User not found');
        sendResponse(res, 200, 'User updated successfully', user);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return sendResponse(res, 404, 'User not found');
        sendResponse(res, 200, 'User removed successfully');
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};
exports.makeAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return sendResponse(res, 404, 'User not found');

        user.isadmin = true;
        await user.save();
        sendResponse(res, 200, 'User is now an admin', user);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};
