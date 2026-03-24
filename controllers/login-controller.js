const User = require("../models/User.js");

exports.displayLoginForm = (req, res) => {
    let msg = "";

    res.render("login-form", {msg});
};

exports.handleLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

  try {
    const user = await User.findOne({username: username});

    if (user && password === user.password) {
        res.redirect("/home");
    } else {
        msg = "Invalid credentials.";

        res.render("login-form", {msg});
    }
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).send("A database error ocurred. Please try again later.");
  }
};

exports.handleSignup = async (req, res) => {
    let msg = "";
    const username = req.body.username;
    const password = req.body.password;
    const fullName = req.body.fullName;
    const phone = req.body.phone;
    const email = req.body.email;
    const gender = req.body.gender;
    const bio = req.body.bio;

    if (username.length < 3) {
        msg = "Username must be at least 3 characters.";

        return res.render("signup-form", {msg});
    }

    if (password.length < 6) {
        msg = "Password must be at least 6 characters.";

        return res.render("signup-form", {msg});
    }

    if (!email.includes("@") || !email.includes(".") || email.includes(" ")) {
        msg = "Please enter a valid email address.";

        return res.render("signup-form", {msg});
    }

    if(phone.length !== 8 || isNaN(phone)) {
        msg = "Phone number must be exactly 8 digits";

        return res.render("signup-form", {msg});
    }

    try {
        const newUser = new User({username, password, fullName, phone, email, gender, bio});
        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        if (error.code === 11000) {
            return res.send("Username already taken.");
        }
        res.send("Signup failed: " + error.message);
    }
};

exports.displaySignupForm = (req, res) => {
    let msg = "";

    res.render("signup-form", {msg});
};
