const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist-controllers");

router.get("/wishlist", wishlistController.getWishlist);

router.post("/wishlist/update-ranking", wishlistController.updateRanking);
router.post("/wishlist/delete", wishlistController.deleteWishlistItem);
router.post("/wishlist/checkout", wishlistController.checkoutPage);
router.post("/wishlist/checkout/submit", wishlistController.postCheckoutPage);
module.exports = router;