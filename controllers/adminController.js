const User = require("../models/User");
const { Listing } = require("../models/Listing");
const Review = require("../models/Review");

exports.showAdminProfile = async (req, res) => {
    try {
        const users = await User.User.find({});
        const listings = await Listing.find({}).populate("landlord", "username");
        const reviews = await Review.Review.find({}).populate("reviewerId", "username").populate("reviewedUserId", "username");

        res.render("admin-profile", {
            user: req.session.user,
            users,
            listings,
            reviews
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error loading admin profile.");
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await Listing.deleteMany({ landlord: req.params.userId });
        await Review.Review.deleteMany({
            $or: [
                { reviewerId: req.params.userId },
                { reviewedUserId: req.params.userId }
            ]
        });
        await User.deleteUserById(req.params.userId);
        res.redirect("/admin-profile");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting user.");
    }
};

exports.deleteListing = async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.listingId);
        res.redirect("/admin-profile");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting listing.");
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await Review.deleteReview(req.params.reviewId);
        res.redirect("/admin-profile");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting review.");
    }
};

exports.deleteComment = async (req, res) => {
    try {
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: { comments: { _id: req.params.commentId } }
        });
        res.redirect("/admin-profile");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting comment.");
    }
};
