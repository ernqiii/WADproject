const express = require("express");

const router = express.Router();
const loginController = require("./controllers/login-controller");

router.get("/login", loginController.displayLoginForm);
router.post("/login", loginController.handleLogin);

router.get("/signup", loginController.displaySignupForm);
router.post("/signup", loginController.handleSignup);

module.exports = router;