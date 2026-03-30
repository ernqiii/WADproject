const User = require("../models/User");
const bcrypt = require("bcrypt");

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

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.render("login-form", {
                msg: "Invalid credentials.",
                username
            });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            fullName: user.fullName
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

exports.handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login-form");
    });
};

exports.handleSignup = async (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password;
    const fullName = req.body.fullName.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const gender = req.body.gender;
    const bio = req.body.bio;

    // check username length
    if (username.length < 3) {
        return res.render("signup-form", {
            msg: "Username must be at least 3 characters.",
            username,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    // check password length
    if (password.length < 6) {
        return res.render("signup-form", {
            msg: "Password must be at least 6 characters.",
            username,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    // check name length
    if (fullName.length > 50) {
        return res.render("signup-form", {
            msg: "Name is too long.",
            username,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    // check email format
    if (!email.includes("@") || !email.includes(".") || email.includes(" ")) {
        return res.render("signup-form", {
            msg: "Please enter a valid email address.",
            username,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    //check phone format
    const cleanPhone = phone.split(" ").join("");

    if (cleanPhone.trim().length !== 8 || isNaN(cleanPhone)) {
        return res.render("signup-form", {
            msg: "Phone number must be exactly 8 digits.",
            username,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    // check bio length
    if (bio && bio.length > 500) {
        return res.render("signup-form", {
            msg: "Bio is too long.",
            username,
            fullName,
            phone,
            email,
            gender,
            bio
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            password: hashedPassword,
            fullName,
            phone: cleanPhone,
            email,
            gender,
            bio: bio ? bio.trim() : ""
        };

        await User.addUser(newUser);
        res.redirect("/login-form");
    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === 11000) {
            const isEmail = error.message.includes("email");

            return res.render("signup-form", {
                msg: isEmail ? "Email is already registered." : "Username is already taken.",
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