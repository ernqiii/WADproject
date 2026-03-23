const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3, //?
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
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

exports.editProfile = function(userId, updateData) {
    return User.findByIdAndUpdate(userId, updateData);
};

exports.User = User;