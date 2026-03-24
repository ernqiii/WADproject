const {User} = require("../models/User.js");

exports.displayLoginForm = (req, res) => {
    let msg = "";
    const username = "";

    res.render("login-form", {msg, username});
};

exports.handleLogin = async (req, res) => {
    let msg = "";
    const username = req.body.username;
    const password = req.body.password;

  try {
    const user = await User.findOne({username: username});

    if (user && password === user.password) {
        res.render("explore");
    } else {
        msg = "Invalid credentials.";

        res.render("login-form", {msg, username});
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

        return res.render("signup-form", {msg, username, password, fullName, phone, email, gender, bio});
    }

    if (password.length < 6) {
        msg = "Password must be at least 6 characters.";

        return res.render("signup-form", {msg, username, password, fullName, phone, email, gender, bio});
    }

    if (!email.includes("@") || !email.includes(".") || email.includes(" ")) {
        msg = "Please enter a valid email address.";

        return res.render("signup-form", {msg, username, password, fullName, phone, email, gender, bio});
    }

    if(phone.length !== 8 || isNaN(phone)) {
        msg = "Phone number must be exactly 8 digits";

        return res.render("signup-form", {msg, username, password, fullName, phone, email, gender, bio});
    }

    try {
        const newUser = new User({username, password, fullName, phone, email, gender, bio});
        await newUser.save();
        res.redirect("/login-form");
    } catch (error) {
        if (error.code === 11000) {
            return res.send("Username already taken.");
        }
        res.send("Signup failed.");
    }
};

exports.displaySignupForm = (req, res) => {
    let msg = "";
    const username = "";
    const password = "";
    const fullName = "";
    const phone = "";
    const email = "";
    const gender = "";
    const bio = "";

    res.render("signup-form", {msg, username, password, fullName, phone, email, gender, bio});
};
