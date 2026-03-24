require("dotenv").config({ path: "./config.env" });

const mongoose = require("mongoose");
const User = require("./models/User").User;
const Listing = require("./models/Listing").Listing;

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 🔥 CLEAR EXISTING (optional)
        await User.deleteMany({});
        await Listing.deleteMany({});

        // ✅ CREATE USERS
        const users = await User.insertMany([
            {
                username: "john123",
                email: "john@test.com",
                password: "123456",
                fullName: "John Tan",
                gender: "Male",
                phone: "91234567",
                bio: "Clean and quiet. Works 9-5."
            },
            {
                username: "sarahlee",
                email: "sarah@test.com",
                password: "123456",
                fullName: "Sarah Lee",
                gender: "Female",
                phone: "92345678",
                bio: "Friendly and loves cooking."
            },
            {
                username: "mike88",
                email: "mike@test.com",
                password: "123456",
                fullName: "Mike Lim",
                gender: "Male",
                phone: "93456789",
                bio: "Night owl, gamer."
            }
        ]);

        console.log("Users created");

        // ✅ CREATE LISTINGS (linked to users)
        await Listing.insertMany([
            {
                title: "Room in Tanjong Pagar",
                location: "Tanjong Pagar",
                rent: 1200,
                description: "Clean condo room near MRT",
                landlord: users[0]._id
            },
            {
                title: "Common Room in Clementi",
                location: "Clementi",
                rent: 900,
                description: "Affordable and spacious",
                landlord: users[1]._id
            }
        ]);

        console.log("Listings created");

        console.log("Seed completed ✅");
        process.exit();

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

seed();