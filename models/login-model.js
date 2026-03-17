const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, trim: true, unique: true},
  password: {type: String, required: true, trim: true},
  fullname: {type: String, required: true, trim: true},
  phone: {type: String, required: true, trim: true},
  email: {type: String, required: true, trim: true},
  gender: {type: String, required: true, trim: true},
  bio: {type: String, required: true, trim: true}
});

module.exports = mongoose.model("User", userSchema);