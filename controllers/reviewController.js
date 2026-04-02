const Review = require("../models/Review");

exports.createReview = async (req, res) => {
    try {
        const { reviewedUserId, rating, comment } = req.body;
        const reviewerId = req.session.user.id;

        if (!reviewedUserId || !rating) {
            return res.send("Rating and reviewed user are required.");
        }

        // Prevent self-review
        if (String(reviewerId) === String(reviewedUserId)) {
            return res.send("You cannot review yourself.");
        }

        const existingReview = await Review.findReviewByReviewerAndUser(
            reviewerId,
            reviewedUserId
        );

        if (existingReview) {
            return res.redirect(`/profile/${reviewedUserId}?error=already_reviewed`);
        }

        await Review.addReview({
            reviewerId,
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

        // Optional safety: only allow owner to edit
        if (String(review.reviewerId) !== String(req.session.user.id)) {
            return res.send("You are not allowed to edit this review.");
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

        const review = await Review.findReviewById(reviewId);

        if (!review) {
            return res.send("Review not found.");
        }

        // Optional safety: only allow owner to update
        if (String(review.reviewerId) !== String(req.session.user.id)) {
            return res.send("You are not allowed to update this review.");
        }

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

        const review = await Review.findReviewById(reviewId);

        if (!review) {
            return res.send("Review not found.");
        }

        // Optional safety: only allow owner to delete
        if (String(review.reviewerId) !== String(req.session.user.id)) {
            return res.send("You are not allowed to delete this review.");
        }

        await Review.deleteReview(reviewId);

        res.redirect(`/profile/${reviewedUserId}`);
    } catch (error) {
        console.log(error);
        res.send("Error deleting review.");
    }
};