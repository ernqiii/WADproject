const express = require("express");
const multer = require("multer");
const router = express.Router();
const profileController = require("../controllers/profileController");

const upload = multer({
    storage: multer.memoryStorage()
});

router.get("/", profileController.getProfile);
router.get("/edit", profileController.getEditProfile);
router.post("/edit", upload.single("profilePicture"), profileController.postEditProfile);

module.exports = router;