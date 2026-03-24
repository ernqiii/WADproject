const express = require('express');
const router = express.Router();
const exploreController = require('../controllers/exploreController');

// Middleware: block unauthenticated users from protected routes
const isLoggedIn = (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ success: false, message: 'Please login to perform this action' });
  }
  next();
};

router.get('/',                                exploreController.getExploreListings);
router.get('/listings/:listingId/comments',    exploreController.getComments);
router.post('/listings/:listingId/like',       isLoggedIn, exploreController.likeListing);
router.post('/listings/:listingId/comment',    isLoggedIn, exploreController.addComment);
router.post('/listings/:listingId/wishlist',   isLoggedIn, exploreController.addToWishlist);

module.exports = router;