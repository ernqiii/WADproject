const express = require("express");
const router = express.Router();
const interestController = require("../controllers/interest-controller");
const userController = require("../controllers/profileController");
const auth = require("../middleware/auth");

router.get("/interest", interestController.getInterestDashboard);


// show user profile with submitted interest forms
router.get("/interest/submitted", auth.isLoggedIn, interestController.getProfile);


// open edit interest form page
router.post("/interest/submitted/edit", auth.isLoggedIn, interestController.getEditInterestPage);

// submit edited interest form
router.post("/interest/submitted/update", auth.isLoggedIn, interestController.updateInterest);

// delete / withdraw interest form
router.post("/interest/submitted/delete", auth.isLoggedIn, interestController.deleteInterest);


// =========================
// Landlord routes
// =========================

// show landlord requests page
router.get("/interest/received", auth.isLoggedIn, interestController.getLandlordRequestsPage);

// update Active / Closed status
router.post("/interest/received/update-status", auth.isLoggedIn, interestController.updateInterestStatus);


module.exports = router;