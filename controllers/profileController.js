const User = require("../models/User");
const Listing = require("../models/Listing");

const DEMO_USER_ID = "69b90b2e6099c414584b3344";

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(DEMO_USER_ID);
        const listings = await Listing.find({ landlord: DEMO_USER_ID });

        if (!user) {
            return res.send("Demo user not found.");
        }

        let profileImage = null;

        if (user.profilePicture && user.profilePictureType) {
            profileImage = `data:${user.profilePictureType};base64,${user.profilePicture.toString("base64")}`;
        }

        res.render("profile", {
            user: user,
            listings: listings,
            profileImage: profileImage
        });
    } catch (error) {
        console.log(error);
        res.send("Error loading profile page.");
    }
};

exports.getEditProfile = async (req, res) => {
    try {
        const user = await User.findById(DEMO_USER_ID);

        if (!user) {
            return res.send("Demo user not found.");
        }

        res.render("editProfile", {
            user: user,
            errorMessage: ""
        });
    } catch (error) {
        console.log(error);
        res.send("Error loading edit profile page.");
    }
};

exports.postEditProfile = async (req, res) => {
    try {
        const { fullName, email, phone, bio } = req.body;

        if (!fullName || !email || !phone) {
            const user = await User.findById(DEMO_USER_ID);

            return res.render("editProfile", {
                user: user,
                errorMessage: "Full name, email, and phone are required."
            });
        }

        const updateData = {
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            bio: bio.trim()
        };

        if (req.file) {
            updateData.profilePicture = req.file.buffer;
            updateData.profilePictureType = req.file.mimetype;
        }

        await User.findByIdAndUpdate(DEMO_USER_ID, updateData);

        res.redirect("/profile");
    } catch (error) {
        console.log(error);
        res.send("Error updating profile.");
    }
};