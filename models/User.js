const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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

module.exports = mongoose.model("User", userSchema);