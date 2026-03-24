const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const server = express();

server.set("view engine", "ejs");
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

const loginRoutes = require("./routes/login-routes");
const profileRoutes = require("./routes/profileRoutes");
const exploreRoutes = require("./routes/explore");
const reviewRoutes = require("./routes/review-routes");

server.use("/", loginRoutes);
server.use("/profile", profileRoutes);
server.use("/explore", exploreRoutes);
server.use("/", reviewRoutes);

// 🔥 change homepage behavior
server.get("/", (req, res) => {
    if (req.session.user) {
        return res.redirect("/explore"); 
    }
    res.redirect("/login-form");
});

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

function startServer() {
    server.listen(process.env.PORT || 8000, () => {
        console.log("Server running at http://localhost:8000/");
    });
}

connectDB().then(startServer);