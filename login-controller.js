const User = require("./login-model");

exports.displayLoginForm = (req, res) => {
  res.render("login-form");
};

exports.handleLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

  try {
    const user = await User.findOne({username: username});

    if (user && password === user.password) {
        req.session.userId = user._id;
        res.redirect("/home");
    } else {
        res.send("Invalid credentials");
    }
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).send("A database error ocurred. Please try again later.");
  }
};

exports.handleSignup = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const gender = req.body.gender;
    const bio = req.body.bio;

    try {
        const newUser = new User({username, password, email, gender, bio});
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
    res.render("signup-form");
};