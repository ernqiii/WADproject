const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    }
});