const express = require("express");

const router = express.Router();
const loginController = require("../controllers/login-controller");



router.get("/login-form", loginController.displayLoginForm);
router.post("/login-form", loginController.handleLogin);

router.get("/signup-form", loginController.displaySignupForm);
router.post("/signup-form", loginController.handleSignup);

router.get("/logout", loginController.handleLogout);

module.exports = router;