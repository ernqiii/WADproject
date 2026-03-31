// Allow any versions of Node.js to connect to MongoDB
const dns = require("dns");
dns.setDefaultResultOrder("verbatim");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const path = require("path");
const server = express();

server.set("view engine", "ejs");
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use("/",express.static(path.join(__dirname,"/public")));

const secret = process.env.SECRET;
server.use(session({
    secret: secret, // sign the session ID cookie. should be a long, random, and secure string, preferably stored in an environment variable
    resave: false, // Prevents the session from being saved back to the session store if nothing has changed.
    saveUninitialized: false // Prevents a new, empty session from being saved to the store.
}));

const loginRoutes = require("./routes/login-routes");
const profileRoutes = require("./routes/profileRoutes");
const exploreRoutes = require("./routes/explore");
const reviewRoutes = require("./routes/review-routes");
const wishlistRoutes = require("./routes/wishlist-routes");
const listingRoutes = require('./routes/createListingRoute');
const interestRoutes = require("./routes/interest-routes");
const adminRoutes = require("./routes/admin-routes");

server.use("/", loginRoutes);
server.use("/profile", profileRoutes);
server.use("/explore", exploreRoutes);
server.use("/", reviewRoutes);
server.use("/", wishlistRoutes);
server.use("/listing", listingRoutes);
server.use("/", interestRoutes);
server.use("/admin-profile", adminRoutes);


// change homepage behavior
//server.get("/", (req, res, next) => {
    //if (req.session.user) {
        //return res.redirect("/explore"); 
    //}
    //next();
//});

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