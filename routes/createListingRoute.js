const express = require('express');
const router = express.Router();
const createListingController = require('../controllers/createListingController');

router.get('/new', createListingController.newListing);
router.post('/', createListingController.createListing);

module.exports = router;