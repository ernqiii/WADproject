const express = require("express");
const router = express.Router();
const interestController = require("../controllers/interest-controller");
router.get("/interest", interestController.getInterestDashboard);


// show user profile with submitted interest forms
router.get("/interest/submitted", interestController.getProfile);


// open edit interest form page
router.post("/interest/submitted/edit", interestController.getEditInterestPage);

// submit edited interest form
router.post("/interest/submitted/update", interestController.updateInterest);

// delete / withdraw interest form
router.post("/interest/submitted/delete", interestController.deleteInterest);


// =========================
// Landlord routes
// =========================

// show landlord requests page
router.get("/interest/received", interestController.getLandlordRequestsPage);

// update Active / Closed status
router.post("/interest/received/update-status", interestController.updateInterestStatus);


module.exports = router;