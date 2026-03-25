const User = require("../models/User");
const Listing = require("../models/Listing");
const Review = require("../models/Review");

exports.showProfile = async (req, res) => {
    try {
        const userId = req.params.userId || req.session.user.id;

        const user = await User.findByUserId(userId);
        const listings = await Listing.findByLandlord(userId);
        const reviews = await Review.findReviewsByUserId(userId);
        const ratingSummary = await Review.getAverageRating(userId);

        if (!user) {
            return res.send("User not found.");
        }

        let profileImage = null;

        if (user.profilePicture && user.profilePictureType) {
            profileImage = `data:${user.profilePictureType};base64,${user.profilePicture.toString("base64")}`;
        }

        res.render("profile", {
            user,
            listings,
            profileImage,
            loggedInUserId: req.session.user.id,
            reviews,
            avgRating: ratingSummary.avgRating,
            totalReviews: ratingSummary.totalReviews
        });
    } catch (error) {
        console.log(error);
        res.send("Error loading profile page.");
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const user = await User.findByUserId(req.session.user.id);

        if (!user) {
            return res.send("User not found.");
        }

        res.render("editProfile", {
            user,
            errorMessage: ""
        });
    } catch (error) {
        console.log(error);
        res.send("Error loading edit profile page.");
    }
};

exports.submitEditProfile = async (req, res) => {
    try {
        const { fullName, email, gender, phone, bio } = req.body;

        if (!fullName || !email || !gender || !phone) {
            const user = await User.findByUserId(req.session.user.id);

            return res.render("editProfile", {
                user,
                errorMessage: "Full name, email, gender, and phone are required."
            });
        }

        const updateData = {
            fullName: fullName.trim(),
            email: email.trim(),
            gender: gender.trim(),
            phone: phone.trim(),
            bio: bio ? bio.trim() : ""
        };

        if (req.file) {
            updateData.profilePicture = req.file.buffer;
            updateData.profilePictureType = req.file.mimetype;
        }

        await User.editProfile(req.session.user.id, updateData);

        res.redirect("/profile");
    } catch (error) {
        console.log(error);
        res.send("Error updating profile.");
    }
};

exports.searchUser = async (req, res) => {
    try {
        const searchTerm = req.body.username ? req.body.username.trim() : "";
        const loggedInUserId = req.session.user.id;

        if (searchTerm === "") {
            return res.render("searchResults", {
                results: [],
                searchTerm: "",
                message: "Please enter a username."
            });
        }

        const currentUser = await User.findByUserId(loggedInUserId);

        if (
            currentUser &&
            currentUser.username.toLowerCase() === searchTerm.toLowerCase()
        ) {
            return res.redirect("/profile");
        }

        const results = await User.searchByUsername(searchTerm);

        res.render("searchResults", {
            results,
            searchTerm,
            message: results.length === 0 ? "No users found." : ""
        });
    } catch (error) {
        console.log(error);
        res.send("Error searching users.");
    }
};