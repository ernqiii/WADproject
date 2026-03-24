const wishlistModel = require("../models/wishlistModel");
const listingModel = require("../models/Listing")
const interestFormModel =require("../models/interestFormModel");

const addToWishlist = async (req, res) => {
  const userId = req.session.userId;
  const listingId = req.body.listingId;
  try {
    let wishlist = await wishlistModel.findByUser(userId);

    if (!wishlist) { 
      await wishlistModel.updateWishlist(userId);
      console.log("successfully updated");
      return res.redirect("/explore");
      
    }
    else{
      const exists = wishlist.items.filter( item => {
        return item.listing.toString() === listingId;
      });

      if (!exists) {
        wishlist.items.push({ listing: listingId });
        await wishlistModel.updateWishlist(wishlist.user, wishlist.items);
        console.log("successfully updated");
      }
      return res.redirect("/explore");
    }  
  } catch (err) {
    
    console.log(error);
    return res.status(500).send("Error in updating wishlist");
  }
};

const getWishlist =  async (req, res) => {
  const userId = req.session.userId;
  try{
    let wishlist = await wishlistModel.findByUser(userId);
     if (!wishlist || !wishlist.items || wishlist.items.length === 0) { 
      res.render("wishlist",{wishlist:"", listingArray:[]});
      
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
  const userId = req.session.userId;
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

    await wishlistModel.updateWishlist(userId, targetItem.ranking);
    return res.redirect("/wishlist");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error updating ranking");
  }
};

const deleteWishlistItem = async (req, res) => {
  const userId = req.session.userId;
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
 
const  postCheckoutPage  = async (req, res) => {
  const userId = req.session.userId;
  const listingId = req.body.listingId;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;

  try {
    const listing = await listingModel.findByListing(listingId);

    if (!listing) {
      return res.redirect("/wishlist");
    }

    await interestFormModel.createForm({
      user: userId,
      listing: listing._id,
      landlord: listing.landlord,
      name: name,
      email: email,
      phone: phone,
      message: message
    });

    return res.render("postCheckout", { listing });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in submitting interest form");
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