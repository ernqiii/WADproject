const Listing2 = require('../models/Listing');
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

exports.newListing = (req, res) => {
  res.render('createListing', { error: null, data: {} });
};


const normalizeAmenities = (amenities) => {
  if (!amenities) return [];
  if (!Array.isArray(amenities)) return [amenities];
  return amenities;
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
        roommates: req.body.roommates,
        room_type: req.body.room_type,
        amenities,
        photos: req.files.map(f => f.filename),
      });

      await listing.save();
      //res.send('Listing Created Successfully!');
      res.redirect('/');
    } catch (e) {
        console.log('Mongoose error:', e.message);
      res.render('createListing', { error: e.message, 
        data: req.body, amenities: normalizeAmenities(req.body.amenities)
      });
    }
  });
};
