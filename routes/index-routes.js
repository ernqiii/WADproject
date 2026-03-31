const express = require("express");
const multer = require("multer");

const router = express.Router();
const indexController = require("../controllers/index-controller");
const loginController = require("../controllers/login-controller");

const upload = multer({
    storage: multer.memoryStorage()
});

router.get("/", indexController.showIndex);

router.get("/login-form", loginController.displayLoginForm);
router.post("/login-form", loginController.handleLogin);

router.get("/signup-form", loginController.displaySignupForm);
//router.post("/signup-form", loginController.handleSignup);

router.post("/signup-form", upload.single("profilePicture"), loginController.handleSignup);

router.get("/logout", loginController.handleLogout);

module.exports = router;