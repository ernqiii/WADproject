const express = require("express");
const multer = require("multer");
const router = express.Router();
const profileController = require("../controllers/profileController");
const auth = require("../middleware/auth");

const upload = multer({
    storage: multer.memoryStorage()
});

router.get("/", auth.isLoggedIn, profileController.showProfile);
router.get("/edit", auth.isLoggedIn, profileController.showEditForm);
router.post("/edit", auth.isLoggedIn, upload.single("profilePicture"), profileController.submitEditProfile);
router.post("/search", auth.isLoggedIn, profileController.searchUser);
router.post("/delete", auth.isLoggedIn, profileController.deleteUser);
router.get("/:userId", auth.isLoggedIn, profileController.showProfile);

module.exports = router;