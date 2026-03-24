const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: String,
    location: String,
    rent: Number,
    description: String,
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Listing = mongoose.model("Listing", listingSchema);

exports.findByLandlord = function(userId) {
    return Listing.find({ landlord: userId });
};

exports.findByListing = function(listingId){
    return Listing.findOne({listingId})
}
exports.Listing = Listing;