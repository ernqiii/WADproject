const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other"
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        default: "",
        trim: true
    },
    profilePicture: {
        type: Buffer,
        default: null
    },
    profilePictureType: {
        type: String,
        default: ""
    }
});

const User = mongoose.model("User", userSchema);

exports.findByUserId = function(userId) {
    return User.findById(userId);
};

exports.findByUsernameExact = function(username) {
    return User.findOne({ username: username });
};

exports.addUser = function(newUser) {
    return User.create(newUser);
};

exports.editProfile = function(userId, updateData) {
    return User.findByIdAndUpdate(userId, updateData);
};

exports.searchByUsername = function(username) {
    return User.find({
        username: { $regex: username, $options: "i" }
    });
};

exports.User = User;