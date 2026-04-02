const wishlistModel = require("../models/wishlistModel");
const listingModel = require("../models/Listing")
const interestFormModel =require("../models/interestFormModel");
const userModel = require("../models/User")


const addToWishlist = async (req, res) => {
  const userId = req.session?.user?.id ||req.session?.user?._id;
  const listingId = req.body.listingId;

  try {
    let wishlist = await wishlistModel.findByUser(userId); //each wishlist has a unqiue user -> find the user -> find their associated wishlist 

    if (!wishlist) {
      await wishlistModel.createWishlist(userId, [{ listing: listingId }]);
      console.log("successfully created wishlist and added listing");
      return res.redirect("/explore");
    } else {
      const exists = wishlist.items.find(item => {
        return item.listing.toString() === listingId;
      });

      if (!exists) {
        wishlist.items.push({ listing: listingId });
        await wishlistModel.updateWishlistItem(wishlist.user, wishlist.items);
        console.log("successfully updated");
      }

      return res.redirect("/explore");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error in updating wishlist");
  }
};
const getWishlist = async (req, res) => {
  const userId = req.session?.user?.id||req.session?.user?._id;

  try {
    let wishlist = await wishlistModel.findByUser(userId);

    if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
      return res.render("wishlist", { wishlist: null, listingArray: [] });
    }

    const listingArray = [];

    for (const item of wishlist.items) {
      const listingObject = await listingModel.findByListing(item.listing);

      if (listingObject) {
        const landlordUser = await userModel.findByUserId(listingObject.landlord);

        listingArray.push({
          listing: listingObject,
          ranking: item.ranking ?? null,
          landlordUser: landlordUser || null
        });
      }
    }

    listingArray.sort((a, b) => {
      if (a.ranking == null && b.ranking == null) return 0;
      if (a.ranking == null) return 1;
      if (b.ranking == null) return -1;
      return a.ranking - b.ranking;
    });

    return res.render("wishlist", { wishlist, listingArray });

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in loading wishlist");
  }
};

  
const updateRanking = async (req, res) => {
  const userId = req.session?.user?.id||req.session?.user?._id;
  const listingId = req.body.listingId;
  const ranking = req.body.ranking;

  try {
    const wishlist = await wishlistModel.findByUser(userId);

    if (!wishlist) {
      return res.redirect("/wishlist");
    }

    const targetItem = wishlist.items.find(item =>
      item.listing.toString() === listingId
    );

    if (!targetItem) {
      return res.redirect("/wishlist");
    }

    targetItem.ranking = ranking ? Number(ranking) : null;

    await wishlistModel.updateWishlistItem(userId, wishlist.items);
    return res.redirect("/wishlist");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error updating ranking");
  }
};

const deleteWishlistItem = async (req, res) => {
  const userId = req.session?.user?.id ||req.session?.user?._id;
  const listingId = req.body.listingId;

  try {
    const wishlist = await wishlistModel.findByUser(userId);

    if (!wishlist) {
      return res.redirect("/wishlist");
    }

    const updatedItems = wishlist.items.filter(item => {
      return item.listing.toString() !== listingId;
    });

    await wishlistModel.updateWishlistItem(userId, updatedItems);

    return res.redirect("/wishlist");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error deleting Listing");
  }
};
const checkoutPage = async (req, res) => {
  const listingId = req.body.listingId;

  try {
    const listing = await listingModel.findByListing(listingId);

    if (!listing) {
      return res.redirect("/wishlist");
    }

    const formData = {
      listing,
      errors: [],
      gender: "",
      message: "",
      name: "",
      email: "",
      contact_method: "",
      phone: "",
      telegram: ""
    };

    return res.render("checkout", formData);

  } catch (error) {
    console.log("CHECKOUT PAGE ERROR:", error);
    return res.status(500).send("Error loading checkout page");
  }
};
const postCheckoutPage = async (req, res) => {
  const userId = req.session?.user?.id||req.session?.user?._id;
  const {
    listingId,
    name,
    email,
    phone,
    telegram,
    contact_method,
    message,
    consent,
    gender
  } = req.body;

  try {
    const listing = await listingModel.findByListing(listingId);

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    if (!listing.landlord) {
      return res.status(400).send("Listing landlord not found");
    }

    const cleanName = name ? name.trim() : "";
    const cleanEmail = email ? email.trim() : "";
    const cleanPhone = phone ? phone.trim() : "";
    const cleanTelegram = telegram ? telegram.trim() : "";
    const cleanMessage = message ? message.trim() : "";

    const errors = [];

    if (!cleanName) {
      errors.push("Please enter your name.");
    }

    if (!gender) {
      errors.push("Please select your gender.");
    }

    if (!consent) {
      errors.push("Please agree to our policy before submitting.");
    }

    if (!cleanEmail && !cleanPhone && !cleanTelegram) {
      errors.push("Please provide at least one contact method: email, phone, or Telegram.");
    }

    if (!contact_method) {
      errors.push("Please select a preferred contact method.");
    }

    if (contact_method === "email" && !cleanEmail) {
      errors.push("You selected email as the preferred contact method, so email is required.");
    }

    if (contact_method === "phone" && !cleanPhone) {
      errors.push("You selected phone as the preferred contact method, so phone is required.");
    }

    if (contact_method === "whatsapp" && !cleanPhone) {
      errors.push("You selected WhatsApp as the preferred contact method, so phone is required.");
    }

    if (contact_method === "telegram" && !cleanTelegram) {
      errors.push("You selected Telegram as the preferred contact method, so Telegram is required.");
    }
    if (contact_method === "telegram") {
      if (!cleanTelegram || cleanTelegram.toLowerCase() === "na" || cleanTelegram.toLowerCase() === "@na") {
        errors.push("Please provide a valid Telegram username.");
      }
    }

    if (errors.length > 0) {
      return res.render("checkout", {
        listing,
        errors: errors,
        name: cleanName,
        gender,
        email: cleanEmail,
        phone: cleanPhone,
        telegram: cleanTelegram,
        contact_method,
        message: cleanMessage
      });
    }

    const createdForm = await interestFormModel.createForm({
      landlord: listing.landlord,
      user: userId,
      listing: listingId,
      name: cleanName,
      gender,
      email: cleanEmail,
      phone: cleanPhone,
      telegram: cleanTelegram,
      preferredContactMethod: contact_method,
      message: cleanMessage,
      status: "Active"
    });

    console.log("Created form:", createdForm);
    const wishlist = await wishlistModel.findByUser(userId);

    
    const updatedItems = wishlist.items.filter(item => {
      return item.listing.toString() !== listingId;
    });

    await wishlistModel.updateWishlistItem(userId, updatedItems);

    return res.render("postCheckout", { listing });

  } catch (error) {
    console.log("POST CHECKOUT ERROR:", error);
    console.log("Validation error details:", error.errors);
    return res.status(500).send("Failed to submit interest form");
  }
};


module.exports = {
  getWishlist,
  addToWishlist,
  updateRanking,
  deleteWishlistItem,
  checkoutPage,
  postCheckoutPage

};