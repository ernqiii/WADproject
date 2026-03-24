const Review = require("../models/Review");

const DEMO_REVIEWER_ID = "PUT_REVIEWER_ID_HERE";

exports.createReview = async (req, res) => {
    try {
        const { reviewedUserId, rating, comment } = req.body;

        if (!reviewedUserId || !rating) {
            return res.send("Rating and reviewed user are required.");
        }

        const existingReview = await Review.findReviewByReviewerAndUser(
            DEMO_REVIEWER_ID,
            reviewedUserId
        );

        if (existingReview) {
            return res.send("You have already reviewed this user.");
        }

        await Review.addReview({
            reviewerId: DEMO_REVIEWER_ID,
            reviewedUserId,
            rating,
            comment
        });

        res.redirect(`/profile/${reviewedUserId}`);
    } catch (error) {
        console.log(error);
        res.send("Error creating review.");
    }
};

exports.showEditReviewForm = async (req, res) => {
    try {
        const review = await Review.findReviewById(req.query.reviewId);

        if (!review) {
            return res.send("Review not found.");
        }

        res.render("editReview", { review });
    } catch (error) {
        console.log(error);
        res.send("Error loading edit review form.");
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { reviewId, rating, comment, reviewedUserId } = req.body;

        await Review.updateReview(reviewId, rating, comment);

        res.redirect(`/profile/${reviewedUserId}`);
    } catch (error) {
        console.log(error);
        res.send("Error updating review.");
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { reviewId, reviewedUserId } = req.body;

        await Review.deleteReview(reviewId);

        res.redirect(`/profile/${reviewedUserId}`);
    } catch (error) {
        console.log(error);
        res.send("Error deleting review.");
    }
};