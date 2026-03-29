const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 200 },
  region: { type: String, required: true, enum: ['North', 'East', 'South', 'West'] },
  location: { type: String, required: true, maxlength: 50 },
  price: { type: Number, required: true, min: 0 },
  roommates: { type: Number, required: true, min: 1 },
  room_type: { type: String, required: true, enum: ['Private Room', 'Shared Room'] },
  amenities: [{ type: String, enum: ['wifi', 'parking', 'ac', 'washing_machine', 'microwave', 'wardrobe', 'dryer', 'fan'] }],
  photos: [String],
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  wishlistedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const Listing = mongoose.model('Listing', listingSchema);

exports.findByLandlord = function(userId) {
    return Listing.find({ landlord: userId });
};

exports.findByListing = function(listingId) {
    return Listing.findOne({ _id: listingId });
};

exports.Listing = Listing;