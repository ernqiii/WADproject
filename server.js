require("dotenv").config({ path: "./config.env" });

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const loginRoutes = require("./routes/login-routes");
const profileRoutes = require("./routes/profileRoutes");
const wishlistRoutes = require("./routes/wishlist-routes");


const app = express();

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        app.get("/", (req, res) => {
            res.send(`
                <h1>Apartment Rental App</h1>
                <p><a href="/profile">Go to User Profile</a></p>
            `);
        });

        app.use("/", loginRoutes);
        app.use("/profile", profileRoutes);
        
        app.use("/", wishlistRoutes);

        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
}

startServer();