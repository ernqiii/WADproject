const express = require("express");
const multer = require("multer");
const router = express.Router();
const profileController = require("../controllers/profileController");

const upload = multer({
    storage: multer.memoryStorage()
});

router.get("/", profileController.showProfile);
router.get("/edit", profileController.showEditForm);
router.post("/edit", upload.single("profilePicture"), profileController.submitEditProfile);

module.exports = router;