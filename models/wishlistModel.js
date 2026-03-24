const mongoose = require('mongoose');

// Create a new ‘book' schema
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
        min: 1
      },
      // optional:
      addedAt: {
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

exports.addToWishlist = function(newItem){
    return wishlist.create(newItem)
}


exports.updateWishlistItem = function(ID, items){
    return wishlist.updateOne({user:ID},{items: items})
}
exports.updateWishlistRanking = function(ID, ranking){
    return wishlist.updateOne({user:ID},{ranking: ranking})
}