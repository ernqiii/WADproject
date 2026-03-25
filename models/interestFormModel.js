const mongoose = require("mongoose");

const interestFormSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const InterestForm = mongoose.model("InterestForm", interestFormSchema, "interestForms");

exports.createForm = function(newForm) {
  return InterestForm.create(newForm);
};
exports.findByLandlord = function(userId) {
    return InterestForm.find({ landlord: userId });
};