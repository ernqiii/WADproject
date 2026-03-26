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
    
  },
  phone: {
    type: String, //since text input is string -> thus data type is string for simplicity 
    
  },
  telegram:{
    type:String,

  },
  preferredContactMethod: {
    type: String,
    enum: ["email", "phone", "whatsapp", "telegram"],
    
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ["Active", "Closed"],
    default: "Active"
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
exports.findByLandlord = function(search_criteria) {
    return InterestForm.find(search_criteria);
};
exports.findByUser = function(search_criteria){
    return InterestForm.find(search_criteria)
}
exports.findByInterest_and_User = function(interestId, userId){
  return InterestForm.findOne({_id: interestId,user: userId});
}
exports.updateInterest = function(interestId,userId, newItem){
  return InterestForm.updateOne({ _id: interestId, user: userId },newItem)
}
exports.deleteInterest = function(interestId,userId){ 
  return InterestForm.deleteOne({_id: interestId,user: userId});
};
exports.findByInterest_and_Landlord= function(interestId, landlordId){
  return InterestForm.findOne({_id: interestId,landlord: landlordId});
}
exports.updateStatus= function(interestId,landlordId,status){
  return InterestForm.updateOne({_id: interestId,landlord: landlordId},{status: status});
}