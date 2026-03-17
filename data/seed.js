const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const Listing = require("../models/Listing");

async function seedData() {
    try {
        console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        await User.deleteMany({});
        await Listing.deleteMany({});

        const demoUser = await User.create({
            username: "demoUser",
            email: "demo@example.com",
            password: "123456",
            fullName: "Demo User",
            phone: "91234567",
            bio: "I am a landlord posting apartment rentals."
        });

        await Listing.create([
            {
                title: "2 Bedroom Condo",
                location: "Tanjong Pagar",
                rent: 3200,
                description: "Near MRT and food centre",
                landlord: demoUser._id
            },
            {
                title: "Studio Apartment",
                location: "Bugis",
                rent: 2400,
                description: "Small but convenient",
                landlord: demoUser._id
            },
            {
                title: "3 Room Flat",
                location: "Bedok",
                rent: 2800,
                description: "Spacious and family-friendly",
                landlord: demoUser._id
            }
        ]);

        console.log("Seed completed successfully");
        console.log("Demo User ID:", demoUser._id.toString());
    } catch (error) {
        console.log("Seed error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Connection closed");
    }
}

seedData();