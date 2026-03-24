require("dotenv").config({ path: "./config.env" });

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const loginRoutes = require("./routes/login-routes");
const profileRoutes = require("./routes/profileRoutes");
const wishlistRoutes = require("./routes/wishlist-routes");
const createListingRoutes = require("./routes/createListingRoute");
const exploreRoutes = require("./routes/explore");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home route
app.get("/", (req, res) => {
    res.render("home");
});

// Routes
app.use("/", loginRoutes);
app.use("/profile", profileRoutes);
app.use("/", wishlistRoutes);
app.use('/listing', createListingRoutes);
app.use("/explore", exploreRoutes);

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
}

startServer();