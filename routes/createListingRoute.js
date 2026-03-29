const express = require('express');
const router = express.Router();
const listingController = require('../controllers/createListingController');
const auth = require('../middleware/auth');

router.get('/new', auth.isLoggedIn, listingController.newListing);
router.post('/', auth.isLoggedIn, listingController.createListing);

router.get('/:id/edit', auth.isLoggedIn, listingController.editListing);
router.post('/:id/edit', auth.isLoggedIn, listingController.updateListing);

router.post('/:id/delete', auth.isLoggedIn, listingController.deleteListing);

router.get('/:id', listingController.viewListing);

module.exports = router;