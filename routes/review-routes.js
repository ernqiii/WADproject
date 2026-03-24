const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");

router.post("/reviews/add", auth.isLoggedIn, reviewController.createReview);
router.get("/reviews/edit", auth.isLoggedIn, reviewController.showEditReviewForm);
router.post("/reviews/update", auth.isLoggedIn, reviewController.updateReview);
router.post("/reviews/delete", auth.isLoggedIn, reviewController.deleteReview);

module.exports = router;