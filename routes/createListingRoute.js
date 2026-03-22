const express = require('express');
const router = express.Router();
const listingController = require('../controllers/createListingController');

router.get('/new', listingController.newListing);
router.post('/', listingController.createListing);

module.exports = router;