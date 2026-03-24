const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 200 },
  region: { type: String, required: true, enum: ['North', 'East', 'South', 'West'] },
  location: { type: String, required: true, maxlength: 50 },
  price: { type: Number, required: true, min: 0 },
  roommates: { type: Number, required: true, min: 1 },
  room_type: { type: String, required: true, enum: ['Private Room', 'Shared Room'] },
  amenities: [{ type: String, enum: ['wifi', 'parking', 'ac'] }],
  photos: [String],
});

module.exports = mongoose.model('Listing2', listingSchema);

exports.findByLandlord = function(userId) {
    return Listing.find({ landlord: userId });
};

exports.findByListing = function(listingId){
    return Listing.findOne({listingId})
}
exports.Listing = Listing;