exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login-form");
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login-form");
    }
    if (req.session.user.role !== "admin") {
        return res.redirect("/profile");
    }
    next();
};