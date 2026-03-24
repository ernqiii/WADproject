const User = require("../models/User");
const Listing = require("../models/createListing");

const DEMO_USER_ID = "69c145ad74f11baa30ed10c9";

exports.showProfile = async (req, res) => {
    try {
        const userId = req.params.userId || DEMO_USER_ID;

        const user = await User.findByUserId(userId);
        const listings = await Listing.findByLandlord(userId);

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
            errorMessage: "",
            results: null,
            searchTerm: ""
        });
    } catch (error) {
        console.log(error);
        res.send("Error loading profile page.");
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const user = await User.findByUserId(DEMO_USER_ID);

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
            const user = await User.findByUserId(DEMO_USER_ID);

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

        await User.editProfile(DEMO_USER_ID, updateData);

        res.redirect("/profile");
    } catch (error) {
        console.log(error);
        res.send("Error updating profile.");
    }
};

exports.searchUser = async (req, res) => {
    try {
        const searchTerm = req.body.username ? req.body.username.trim() : "";
        const currentUser = await User.findByUserId(DEMO_USER_ID);
        const listings = await Listing.findByLandlord(DEMO_USER_ID);

        if (!currentUser) {
            return res.send("User not found.");
        }

        let profileImage = null;

        if (currentUser.profilePicture && currentUser.profilePictureType) {
            profileImage = `data:${currentUser.profilePictureType};base64,${currentUser.profilePicture.toString("base64")}`;
        }

        let results = [];

        if (searchTerm !== "") {
            results = await User.searchByUsername(searchTerm);
        }

        res.render("profile", {
            user: currentUser,
            listings,
            profileImage,
            errorMessage: "",
            results,
            searchTerm
        });
    } catch (error) {
        console.log(error);
        res.send("Error searching users.");
    }
};