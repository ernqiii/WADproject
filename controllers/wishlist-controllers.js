const wishlist_Array=[["/room1.png","room1","2 bedrooms", "a nice quaint place to stay"],["/room2.png","room2","1 bedroom", "a convenient location"],["/room3.png","room3","2 bedrooms", "a strong cultural identity"], ["/room4.png","room4","3 bedrooms", "comfortable place to stay with breathtaking views"]]




const getWishlist = (req, res) => {
  res.render("wishlist", { wishlist_Array });
};

const postCheckout = (req, res) => {
  const checkout_item_img = req.body.checkout_item;

  let checkout_item = [];

  wishlist_Array.forEach((wishlistItems) => {
    if (wishlistItems[1] === checkout_item_img) {
      checkout_item = wishlistItems;
    }
  });

  res.render("checkout", { checkout_item });
};

module.exports = {
  getWishlist,
  postCheckout
};