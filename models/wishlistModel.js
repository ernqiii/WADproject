const mongoose = require('mongoose');

// Create a new ‘wishlist' schema
const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [
    {
      listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing", //optional
        required: true
      },
      ranking: {
        type: Number,
        min: 1,
        default : null
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});
  

const wishlist = mongoose.model('Wishlist', wishlistSchema,'wishlistItems');

//Methods here
exports.findByUser = function(ID){
    return wishlist.findOne({user: ID})
}


exports.createWishlist = function(userId, items) {
  return wishlist.create({
    user: userId,
    items: items,
    
  });
};

exports.updateWishlistItem = function(ID, items){
    return wishlist.updateOne({user:ID},{items: items})
}
