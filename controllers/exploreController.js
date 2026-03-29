const { Listing } = require('../models/Listing');

// Helper: find a listing by ID or send a 404 response
async function findListing(res, listingId) {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    res.status(404).json({ success: false, message: 'Listing not found' });
    return null;
  }
  return listing;
}

// GET /explore — render the explore page with listings from database
const getExploreListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('landlord', 'username email')
      .populate('comments.user', 'username');
    res.render('explore', {
      listings,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.render('explore', { listings: [], user: req.session.user });
  }
};

// POST /explore/listings/:listingId/like — toggle like on a listing
const likeListing = async (req, res) => {
  try {
    const listing = await findListing(res, req.params.listingId);
    if (!listing) return;

    const userId = req.session.user.id;
    const alreadyLiked = listing.likes.some(id => id.toString() === userId.toString());

    if (alreadyLiked) listing.likes = listing.likes.filter(id => id.toString() !== userId.toString());
    else listing.likes.push(userId);

    await listing.save();
    res.json({ success: true, liked: !alreadyLiked, likeCount: listing.likes.length });
  } catch (error) {
    console.error('Error liking listing:', error);
    res.status(500).json({ success: false, message: 'Failed to like listing' });
  }
};

// POST /explore/listings/:listingId/comment — add a comment to a listing
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const listing = await findListing(res, req.params.listingId);
    if (!listing) return;

    listing.comments.push({ user: req.session.user.id, text: text.trim(), createdAt: new Date() });
    await listing.save();

    const updated = await Listing.findById(req.params.listingId).populate('comments.user', 'name email');
    const newComment = updated.comments[updated.comments.length - 1];

    res.json({ success: true, comment: newComment, commentCount: listing.comments.length });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};

// GET /explore/listings/:listingId/comments — fetch all comments for a listing
const getComments = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate('comments.user', 'name email');
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.json({ success: true, comments: listing.comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};

// POST /explore/listings/:listingId/wishlist — toggle wishlist on a listing
const addToWishlist = async (req, res) => {
  try {
    const listing = await findListing(res, req.params.listingId);
    if (!listing) return;

    const userId = req.session.user.id;
    const alreadyWishlisted = listing.wishlistedBy.some(id => id.toString() === userId.toString());

    if (alreadyWishlisted) listing.wishlistedBy = listing.wishlistedBy.filter(id => id.toString() !== userId.toString());
    else listing.wishlistedBy.push(userId);

    await listing.save();
    res.json({
      success: true,
      wishlisted: !alreadyWishlisted,
      message: alreadyWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ success: false, message: 'Failed to update wishlist' });
  }
};

// PUT /explore/listings/:listingId/comments/:commentId — edit own comment
const editComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const listing = await findListing(res, req.params.listingId);
    if (!listing) return;

    const comment = listing.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.session.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only edit your own comments' });
    }

    comment.text = text.trim();
    await listing.save();

    res.json({ success: true, comment });
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ success: false, message: 'Failed to edit comment' });
  }
};

// DELETE /explore/listings/:listingId/comments/:commentId — delete own comment
const deleteComment = async (req, res) => {
  try {
    const listing = await findListing(res, req.params.listingId);
    if (!listing) return;

    const comment = listing.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.session.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own comments' });
    }

    listing.comments.pull(req.params.commentId);
    await listing.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete comment' });
  }
};

module.exports = { getExploreListings, likeListing, addComment, getComments, editComment, deleteComment, addToWishlist };