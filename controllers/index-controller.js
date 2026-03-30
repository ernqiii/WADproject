exports.showIndex = (req, res) => {
    const currentUser = req.session.user || null;

    res.render("index", {
        user: currentUser
    });
}