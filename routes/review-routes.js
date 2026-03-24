const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/reviews/add", reviewController.createReview);
router.get("/reviews/edit", reviewController.showEditReviewForm);
router.post("/reviews/update", reviewController.updateReview);
router.post("/reviews/delete", reviewController.deleteReview);

module.exports = router;