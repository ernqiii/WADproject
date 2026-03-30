//const Listing = require('../models/Listing');
//const { Listing, findByLandlord, findByListing } = require('../models/Listing');
// const multer = require('multer');
// const path = require('path');
const { Listing } = require('../models/Listing');
const wishlistModel = require('../models/wishlistModel');
const multer = require('multer');
// const upload = multer({ 
//   dest: path.join(__dirname, '../uploads/'), 
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   },
//   limits: { files: 3 }
// });
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }
 });

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

exports.handleUpload = (view) => (req, res, next) => {
  upload.array('photos', 3)(req, res, (err) => {
    if (err && (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE')) {
      return res.render(view, {
        error: 'Maximum 3 photos allowed!',
        data: { ...req.body, _id: req.params.id },
        amenities: []
      });
    }
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.render(view, {
        error: 'Each photo must be under 2MB!',
        data: { ...req.body, _id: req.params.id },
        amenities: []
      });
    }
    if (err) {
      return res.render(view, {
        error: 'Upload error: ' + err.message,
        data: { ...req.body, _id: req.params.id },
        amenities: []
      });
    }
    next();
  });
};

const normalizeAmenities = (amenities) => {
  if (!amenities) return [];
  if (!Array.isArray(amenities)) return [amenities];
  return amenities;
};

exports.newListing = (req, res) => {
  res.render('createListing', { error: null, data: {}, user: req.session.user });
};

exports.createListing = async (req, res) => {
  const amenities = normalizeAmenities(req.body.amenities);
 
  try {
    // if (req.files && req.files.length > 3) {
    //   return res.render('createListing', {
    //     error: 'Maximum 3 photos allowed!',
    //     data: req.body, amenities
    //   });
    // }
 
    for (const file of (req.files || [])) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.render('createListing', {
          error: 'Only JPG, JPEG and PNG images are allowed!',
          data: req.body, amenities
        });
      }
    }
 
    const photos = (req.files || []).map(f => ({
      data: f.buffer,
      contentType: f.mimetype
    }));
 
    const listing = new Listing({
      title: req.body.title,
      description: req.body.description,
      region: req.body.region,
      location: req.body.location,
      price: req.body.price,
      room_type: req.body.room_type,
      roommates: req.body.roommates,
      my_gender: req.body.my_gender,
      amenities,
      photos,
      landlord: req.session.user.id
    });
 
    await listing.save();
    res.redirect('/profile');
  } catch (e) {
    console.log('Mongoose error:', e.message);
    res.render('createListing', { error: e.message, data: req.body, amenities });
  }
};

exports.editListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.send('Listing not found');

    if (listing.landlord.toString() !== req.session.user.id) {
      return res.send('Not authorized');
    }

    res.render('editListing', { data: listing, error: null });
  } catch (e) {
    res.send('Error: ' + e.message);
  }
};

exports.updateListing = async (req, res) => {
  const amenities = normalizeAmenities(req.body.amenities);
 
  try {
    const oldListing = await Listing.findById(req.params.id);
    if (!oldListing) return res.send('Listing not found');
 
    if (oldListing.landlord.toString() !== req.session.user.id) {
      return res.send('Not authorized');
    }
 
    // if (req.files && req.files.length > 3) {
    //   return res.render('editListing', {
    //     error: 'Maximum 3 photos allowed!',
    //     data: { ...req.body, _id: req.params.id }, amenities
    //   });
    // }
 
    for (const file of (req.files || [])) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.render('editListing', {
          error: 'Only JPG, JPEG and PNG images are allowed!',
          data: { ...req.body, _id: req.params.id }, amenities
        });
      }
    }
 
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      region: req.body.region,
      location: req.body.location,
      price: req.body.price,
      roommates: req.body.roommates,
      room_type: req.body.room_type,
      my_gender: req.body.my_gender,
      amenities,
    };
 
    if (req.files && req.files.length > 0) {
      updateData.photos = req.files.map(f => ({
        data: f.buffer,
        contentType: f.mimetype
      }));
    }
 
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { runValidators: true, returnDocument: 'after' }
    );
 
    res.redirect('/listing/' + listing._id);
  } catch (e) {
    res.render('editListing', {
      data: { ...req.body, _id: req.params.id },
      error: e.message
    });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).send('Listing not found');

    if (listing.landlord.toString() !== req.session.user.id) {
      return res.send('Not authorized');
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting listing');
  }
};

exports.viewListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('comments.user', 'username');
    if (!listing) return res.send('Listing not found');

    let isWishlisted = false;
    if (req.session.user) {
      const wishlist = await wishlistModel.findByUser(req.session.user.id);
      if (wishlist) {
        isWishlisted = wishlist.items.some(item => item.listing.toString() === listing._id.toString());
      }
    }

    res.render('viewListing', { listing, user: req.session.user || null, isWishlisted });
  } catch (e) {
    res.send('Error: ' + e.message);
  }
};

