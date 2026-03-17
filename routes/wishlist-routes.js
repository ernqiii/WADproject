const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist-controllers");

router.get("/wishlist", wishlistController.getWishlist);
router.post("/checkout", wishlistController.postCheckout);

module.exports = router;