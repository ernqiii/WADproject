const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reviewedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema);

exports.addReview = function(newReview) {
    return Review.create(newReview);
};

exports.findReviewsByUserId = function(userId) {
    return Review.find({ reviewedUserId: userId }).populate("reviewerId");
};

exports.findReviewById = function(reviewId) {
    return Review.findById(reviewId);
};

exports.findReviewByReviewerAndUser = function(reviewerId, reviewedUserId) {
    return Review.findOne({ reviewerId, reviewedUserId });
};

exports.updateReview = function(reviewId, rating, comment) {
    return Review.updateOne(
        { _id: reviewId },
        { $set: { rating, comment } }
    );
};

exports.deleteReview = function(reviewId) {
    return Review.deleteOne({ _id: reviewId });
};

exports.getAverageRating = async function(userId) {
    const result = await Review.aggregate([
        { $match: { reviewedUserId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: "$reviewedUserId",
                avgRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    if (result.length === 0) {
        return { avgRating: 0, totalReviews: 0 };
    }

    return {
        avgRating: result[0].avgRating,
        totalReviews: result[0].totalReviews
    };
};

exports.Review = Review;