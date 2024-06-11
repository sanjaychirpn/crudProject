const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    address: { type: String },
    gender: { type: String },
    dob: { type: Date },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isadmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
