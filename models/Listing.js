const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 200 },
  region: { type: String, required: true, enum: [
    'North', 
    'North-West', 
    'North-East', 
    'East', 
    'South', 
    'South-West', 
    'South-East', 
    'West', 
    'Central'
  ] },
  location: { type: String, required: true, maxlength: 50 },
  price: { type: Number, required: true, min: 0 },
  room_type: { type: String, required: true, enum: ['Private Room', 'Shared Room'] },
  roommates: { type: Number, required: true, min: 1 },
  my_gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  preferred_gender: { type: String, required: true, enum: ['Male', 'Female', 'Any'] },
  amenities: [{ type: String,
  enum: [
    'wifi',
    'parking',
    'ac',
    'washing_machine',
    'dryer',
    'refrigerator',
    'microwave',
    'fan',
    'wardrobe',
    'iron'
  ]
}],
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

//const Listing = mongoose.model('Listing', listingSchema);
const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

function findByLandlord(userId) {
  return Listing.find({ landlord: userId });
}

function findByListing(listingId) {
  return Listing.findById(listingId); 
}

module.exports = {
  Listing,
  findByLandlord,
  findByListing
};

// exports.findByLandlord = function(userId) {
//     return Listing.find({ landlord: userId });
// };

// exports.findByListing = function(listingId) {
//     return Listing.findOne({ _id: listingId });
// };

// exports.Listing = Listing;