const wishlistModel = require("../models/wishlistModel");
const listingModel = require("../models/Listing")
const interestFormModel =require("../models/interestFormModel");


const addToWishlist = async (req, res) => {
  const userId = req.session?.user?.id || "temp-user-1";
  const listingId = req.body.listingId;

  try {
    let wishlist = await wishlistModel.findByUser(userId);

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
const getWishlist =  async (req, res) => {
  const userId = req.session?.user?.id || "temp-user-1";
  try{
    let wishlist = await wishlistModel.findByUser(userId);
     if (!wishlist || !wishlist.items || wishlist.items.length === 0) { 
      res.render("wishlist",{wishlist:null, listingArray:[]});
      
    }
    else{
      const listingArray = []
      for (const item of wishlist.items) {
        const listingObject = await listingModel.findByListing(item.listing);
        listingArray.push({
          listing: listingObject,
          ranking: item.ranking || null
        });
      }
      listingArray.sort((a, b) => {
        if (a.ranking == null && b.ranking == null) return 0;
        if (a.ranking == null) return 1;
        if (b.ranking == null) return -1;
        return a.ranking - b.ranking;
      });
      res.render("wishlist",{wishlist, listingArray})
    }
  }
  catch(error){
    console.log(error);
    return res.status(500).send("Error in loading wishlist");

  }
};
  
const updateRanking = async (req, res) => {
  const userId = req.session?.user?.id || "temp-user-1";
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
  const userId = req.session?.user?.id || "temp-user-1";
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
    else{
      return res.render("checkout", { listing });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error loading checkout page");
  }
};
 
const postCheckoutPage = async (req, res) => {
  const userId = req.session?.user?._id;
  const { listingId, name, email, phone, telegram, contact_method, message, consent } = req.body;

  try {
    const listing = await listingModel.findByListing(listingId);

    const cleanEmail = email ? email.trim() : "";
    const cleanPhone = phone ? phone.trim() : "";
    const cleanTelegram = telegram ? telegram.trim() : "";
    const cleanName = name ? name.trim() : "";
    const cleanMessage = message ? message.trim() : "";

    let error = "";

    if (!consent) {
      error = "Please agree to our policy before submitting.";
      return res.render("checkout", {
        listing,
        error,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        telegram: cleanTelegram,
        contact_method,
        message: cleanMessage,
      });
    }

    if (!cleanEmail && !cleanPhone && !cleanTelegram) {
      error = "Please provide at least one contact method: email, phone, or Telegram.";
      return res.render("checkout", {
        listing,
        error,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        telegram: cleanTelegram,
        contact_method,
        message: cleanMessage,
      });
    }

    if (!contact_method) {
      error = "Please select a preferred contact method.";
      return res.render("checkout", {
        listing,
        error,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        telegram: cleanTelegram,
        contact_method,
        message: cleanMessage,
      });
    }

    if (contact_method === "email" && !cleanEmail) {
      error = "You selected email as the preferred contact method, so email is required.";
      return res.render("checkout", {
        listing,
        error,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        telegram: cleanTelegram,
        contact_method,
        message: cleanMessage,
      });
    }

    if (contact_method === "phone" && !cleanPhone) {
      error = "You selected phone as the preferred contact method, so phone is required.";
      return res.render("checkout", {
        listing,
        error,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        telegram: cleanTelegram,
        contact_method,
        message: cleanMessage,
      });
    }

    if (contact_method === "whatsapp" && !cleanPhone) {
      error = "You selected WhatsApp as the preferred contact method, so phone is required.";
      return res.render("checkout", {
        listing,
        error,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        telegram: cleanTelegram,
        contact_method,
        message: cleanMessage,
      });
    }

    if (contact_method === "telegram" && !cleanTelegram) {
      error = "You selected Telegram as the preferred contact method, so Telegram is required.";
      return res.render("checkout", {
        listing,
        error,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        telegram: cleanTelegram,
        contact_method,
        message: cleanMessage,
      });
    }
    console.log(listing)
    console.log(listing.landlord)
    await interestFormModel.createForm({
      landlord: listing.landlord,
      user: userId,
      listing: listingId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      telegram: cleanTelegram,
      preferredContactMethod: contact_method,
      message: cleanMessage,
      status: "Active"
    });

    return res.render("postCheckout", { listing });

  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to submit interest form");
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