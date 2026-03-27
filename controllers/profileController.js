const User = require("../models/User");
const Listing = require("../models/Listing");
const Review = require("../models/Review");

exports.showProfile = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

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
            listings: listings || [],
            profileImage,
            loggedInUserId: req.session.user.id,
            reviews: reviews || [],
            avgRating: ratingSummary ? ratingSummary.avgRating : 0,
            totalReviews: ratingSummary ? ratingSummary.totalReviews : 0
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error loading profile page.");
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

        if (!fullName.trim() || !email.trim() || !gender || !phone.trim()) {
            const user = await User.findByUserId(req.session.user.id);

            return res.render("editProfile", {
                user,
                errorMessage: "Full name, email, gender, and phone are required."
            });
        }

        // check email format
        if (!email.includes("@") || !email.includes(".") || email.includes(" ") || email.indexOf("@") > email.indexOf(".")) {
            const user = await User.findByUserId(req.session.user.id);
            return res.render("editProfile", {
                user,
                errorMessage: "Please enter a valid email address."
            });
        }

        // check phone format
        const cleanPhone = phone.split(" ").join("");

        if (cleanPhone.trim().length !== 8|| isNaN(cleanPhone)) {
            const user = await User.findByUserId(req.session.user.id);
            return res.render("editProfile", {
                user,
                errorMessage: "Please enter a valid phone number."
            });
        }

        // check name length
        if (fullName.length > 50) {
            const user = await User.findByUserId(req.session.user.id);
            return res.render("editProfile", {
                user,
                errorMessage: "Name is too long."
            });
        }

        // check bio length
        if (bio && bio.length > 500) {
            const user = await User.findByUserId(req.session.user.id);
            return res.render("editProfile", {
                user,
                errorMessage: "Bio is too long."
            });
        }

        const updateData = {
            fullName: fullName.trim(),
            email: email.trim(),
            gender: gender.trim(),
            phone: cleanPhone.trim(),
            bio: bio ? bio.trim() : ""
        };

        if (req.file) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

            // check file type
            if (!allowedTypes.includes(req.file.mimetype)) {
                const user = await User.findByUserId(req.session.user.id);
                return res.render("editProfile", {
                    user, 
                    errorMessage: "Only JPG, JPEG, and PNG files are allowed."
                });
            }

            // check file size
            if (req.file.size > 2 * 1024 * 1024) {
                const user = await User.findByUserId(req.session.user.id) 
                return res.render("editProfile", {
                    user, 
                    errorMessage: "Image file is too large. Max @MB is allowed."
                });
                
            }

            updateData.profilePicture = req.file.buffer;
            updateData.profilePictureType = req.file.mimetype;
        }

        await User.editProfile(req.session.user.id, updateData);

        res.redirect("/profile");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating profile.");
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