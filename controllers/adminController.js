const User = require("../models/User");
const { Listing } = require("../models/Listing");
const Review = require("../models/Review");

exports.showAdminProfile = async (req, res) => {
    try {
        const allUsers = await User.User.find({});
        const allListings = await Listing.find({}).populate("landlord", "username");
        const allReviews = await Review.Review.find({}).populate("reviewerId", "username").populate("reviewedUserId", "username");

        res.render("admin-profile", {
            user: req.session.user,
            results: null,
            searchTerm: "",
            allUsers,
            allListings,
            allReviews
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error loading admin profile.");
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const searchTerm = req.body.username ? req.body.username.trim() : "";

        const matchedUsers = await User.User.find({
            username: { $regex: searchTerm, $options: "i" },
            role: { $ne: "admin" }
        });

        const results = await Promise.all(matchedUsers.map(async (u) => {
            const listings = await Listing.find({ landlord: u._id }).lean();
            const reviews = await Review.Review.find({ reviewedUserId: u._id })
                .populate("reviewerId", "username").lean();
            return { u, listings, reviews };
        }));

        const allUsers = await User.User.find({});
        const allListings = await Listing.find({}).populate("landlord", "username");
        const allReviews = await Review.Review.find({}).populate("reviewerId", "username").populate("reviewedUserId", "username");

        res.render("admin-profile", {
            user: req.session.user,
            results,
            searchTerm,
            allUsers,
            allListings,
            allReviews
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error searching users.");
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

exports.promoteToAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;

        await Listing.deleteMany({ landlord: userId });
        await Review.Review.deleteMany({
            $or: [
                { reviewerId: userId },
                { reviewedUserId: userId }
            ]
        });
        await Listing.updateMany(
            {},
            { $pull: { comments: { user: userId } } }
        );
        await User.User.findByIdAndUpdate(userId, { role: "admin" });

        res.redirect("/admin-profile");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error promoting user to admin.");
    }
};
