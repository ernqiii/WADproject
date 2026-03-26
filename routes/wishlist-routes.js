const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist-controllers");

router.get("/wishlist", wishlistController.getWishlist);
router.post("/wishlist/add", wishlistController.addToWishlist);

router.post("/wishlist/update", wishlistController.updateRanking);
router.post("/wishlist/delete", wishlistController.deleteWishlistItem);
router.post("/wishlist/checkout", wishlistController.checkoutPage);
router.post("/wishlist/checkout/submit", wishlistController.postCheckoutPage);
// User profile / interest form routes

// show user profile with submitted interest forms
router.get("/profile", userController.getProfile);


// open edit interest form page
router.post("/interest/edit", userController.getEditInterestPage);

// submit edited interest form
router.post("/interest/update", userController.updateInterest);

// delete / withdraw interest form
router.post("/interest/delete", userController.deleteInterest);



// Landlord routes


// show landlord requests page
router.get("/landlord/requests", landlordController.getLandlordRequestsPage);

// update Active / Closed status
router.post("/landlord/interest/update-status", landlordController.updateInterestStatus);

module.exports = router;