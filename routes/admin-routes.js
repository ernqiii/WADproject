const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.get("/", auth.isAdmin, adminController.showAdminProfile);
router.post("/delete-user/:userId", auth.isAdmin, adminController.deleteUser);
router.post("/delete-listing/:listingId", auth.isAdmin, adminController.deleteListing);
router.post("/delete-review/:reviewId", auth.isAdmin, adminController.deleteReview);
router.post("/delete-comment/:listingId/:commentId", auth.isAdmin, adminController.deleteComment);

module.exports = router;
