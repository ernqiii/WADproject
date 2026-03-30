//const Listing = require('../models/Listing');
//const { Listing, findByLandlord, findByListing } = require('../models/Listing');
const { Listing } = require('../models/Listing');
const multer = require('multer');
const path = require('path');

const upload = multer({ 
  dest: path.join(__dirname, '../uploads/'), 
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { files: 3 }
});

const normalizeAmenities = (amenities) => {
  if (!amenities) return [];
  if (!Array.isArray(amenities)) return [amenities];
  return amenities;
};

exports.newListing = (req, res) => {
  res.render('createListing', { error: null, data: {}, user: req.session.user });
};

exports.createListing = (req, res) => {
  upload.array('photos', 3)(req, res, async function(err) {  
    if (err) {
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.render('createListing', { error: 'Error: Maximum 3 photos allowed!', 
            data: req.body, amenities: normalizeAmenities(req.body.amenities)
        });
      }
      return res.render('createListing', { error: 'Upload error: ' + err.message,
        data: req.body, amenities: normalizeAmenities(req.body.amenities)
      });
    }

    let amenities = req.body.amenities;
    if (!amenities) amenities = [];
    else if (!Array.isArray(amenities)) amenities = [amenities];

    
    try {
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
        photos: req.files.map(f => f.filename),
        landlord: req.session.user.id
      });

      await listing.save();
      res.redirect('/profile');
    } catch (e) {
        console.log('Mongoose error:', e.message);
      res.render('createListing', { error: e.message, 
        data: req.body, amenities: normalizeAmenities(req.body.amenities)
      });
    }
  });
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

exports.updateListing = (req, res) => {
  upload.array('photos', 3)(req, res, async function(err) {
    const amenities = normalizeAmenities(req.body.amenities);

    try {
      const oldListing = await Listing.findById(req.params.id);
      if (!oldListing) return res.send('Listing not found');

      // Ownership check
      if (oldListing.landlord.toString() !== req.session.user.id) {
        return res.send('Not authorized');
      }

      if (err) {
        let errorMsg = err.code === 'LIMIT_FILE_COUNT'
          ? 'Maximum 3 photos allowed!'
          : 'Upload error: ' + err.message;
        return res.render('editListing', {
          data: { ...req.body, _id: req.params.id },
          error: errorMsg
        });
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
        ...(req.files.length > 0 && { photos: req.files.map(f => f.filename) })
      };

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
  });
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
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.send('Listing not found');
    res.render('viewListing', { listing });
  } catch (e) {
    res.send('Error: ' + e.message);
  }
};
