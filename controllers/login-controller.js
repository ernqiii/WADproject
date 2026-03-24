const User = require("../models/User");

exports.displayLoginForm = (req, res) => {
    res.render("login-form", {
        msg: "",
        username: ""
    });
};

exports.handleLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findByUsernameExact(username);

        if (!user) {
            return res.render("login-form", {
                msg: "Invalid credentials.",
                username
            });
        }

        const match = password === user.password;

        if (!match) {
            return res.render("login-form", {
                msg: "Invalid credentials.",
                username
            });
        }

        req.session.user = {
            id: user._id,
            username: user.username
        };

        res.redirect("/explore");
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("A database error occurred. Please try again later.");
    }
};

exports.displaySignupForm = (req, res) => {
    res.render("signup-form", {
        msg: "",
        username: "",
        password: "",
        fullName: "",
        phone: "",
        email: "",
        gender: "",
        bio: ""
    });
};

exports.handleSignup = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const fullName = req.body.fullName;
    const phone = req.body.phone;
    const email = req.body.email;
    const gender = req.body.gender;
    const bio = req.body.bio;

    if (username.length < 3) {
        return res.render("signup-form", {
            msg: "Username must be at least 3 characters.",
            username,
            password,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    if (password.length < 6) {
        return res.render("signup-form", {
            msg: "Password must be at least 6 characters.",
            username,
            password,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    if (!email.includes("@") || !email.includes(".") || email.includes(" ")) {
        return res.render("signup-form", {
            msg: "Please enter a valid email address.",
            username,
            password,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    if (phone.length !== 8 || isNaN(phone)) {
        return res.render("signup-form", {
            msg: "Phone number must be exactly 8 digits.",
            username,
            password,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    try {
        const newUser = {
            username,
            password,
            fullName,
            phone,
            email,
            gender,
            bio
        };

        await User.addUser(newUser);
        res.redirect("/login-form");
    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === 11000) {
            return res.render("signup-form", {
                msg: "Username already taken.",
                username,
                password,
                fullName,
                phone,
                email,
                gender,
                bio
            });
        }

        res.status(500).send("Signup failed.");
    }
};