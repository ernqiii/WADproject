// Utility to populate and clear the database with sample listings
// Usage: node data/seedListings.js (after adding user IDs below)

const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const sampleListings = require('./listings');

// Insert sample listings into the DB, cycling through the provided user IDs
async function seedListings(userIds) {
  if (!userIds || userIds.length === 0) {
    throw new Error('No user IDs provided. Please create users first.');
  }

  const listingsWithUsers = sampleListings.map((listing, i) => ({
    ...listing,
    createdBy: userIds[i % userIds.length],
    images: [], likes: [], comments: [], wishlistedBy: []
  }));

  const result = await Listing.insertMany(listingsWithUsers);
  console.log(`Seeded ${result.length} listings`);
  return result;
}

// Remove all listings from the database
async function clearListings() {
  const result = await Listing.deleteMany({});
  console.log(`Deleted ${result.deletedCount} listings`);
  return result;
}

module.exports = { seedListings, clearListings };

// Run directly with: node data/seedListings.js
if (require.main === module) {
  (async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/roommate-finder');
      console.log('Connected to MongoDB');

      // TODO: replace with real user ObjectIds from your database
      // Tip: run `db.users.find({}, {_id: 1})` in the MongoDB shell to get them
      const userIds = [];

      if (userIds.length === 0) {
        console.log('Add at least one user ID to the userIds array before seeding.');
      } else {
        await seedListings(userIds);
      }
    } catch (error) {
      console.error('Seeding failed:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
  })();
}