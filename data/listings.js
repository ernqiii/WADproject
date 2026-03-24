// 10 sample listings for the roommate finder explore page
// This file exports an array of listing objects that can be used to populate the database

const sampleListings = [
  {
    title: 'Cozy Room in Central District',
    description: 'Looking for a comfortable room in the heart of the city. Close to MRT stations and amenities. Perfect for working professionals. The room is fully furnished with a queen bed, study desk, and built-in wardrobe.',
    location: 'Central',
    type: 'room',
    gender: 'Any',
    price: 800,
    amenities: ['WiFi', 'Air Conditioning', 'Near MRT', 'Furnished']
  },
  {
    title: 'Female Roommate Wanted - East Coast',
    description: 'I have a spacious apartment near East Coast Park and looking for a friendly female roommate. The place has 2 bedrooms, modern kitchen, and a nice balcony view. I work from home so prefer someone organized and clean.',
    location: 'East',
    type: 'roommate',
    gender: 'Female',
    price: 950,
    amenities: ['WiFi', 'Air Conditioning', 'Near Beach', 'Gym Access', 'Pool']
  },
  {
    title: 'Affordable Room in North Region',
    description: 'Budget-friendly option for students or young professionals. Quiet neighborhood, good transport links. Room comes fully furnished with wardrobe and study desk. Utilities included in the rent.',
    location: 'North',
    type: 'room',
    gender: 'Male',
    price: 600,
    amenities: ['WiFi', 'Furnished', 'Near Bus Stop', 'Quiet Area']
  },
  {
    title: 'Looking for Male Roommate - West Side',
    description: 'Clean and tidy apartment in the west. I work from home so prefer someone who is respectful and organized. Common areas are shared. Must be pet-friendly as I have a small dog.',
    location: 'West',
    type: 'roommate',
    gender: 'Male',
    price: 750,
    amenities: ['WiFi', 'Air Conditioning', 'Near Shopping Mall', 'Parking', 'Pet Friendly']
  },
  {
    title: 'Premium Studio Room - CBD',
    description: 'Luxury studio apartment perfect for executives. Fully furnished with modern appliances, 24/7 security, and concierge service. Walking distance to business district and shopping centers.',
    location: 'Central',
    type: 'room',
    gender: 'Any',
    price: 1500,
    amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Pool', 'Security', 'Concierge']
  },
  {
    title: 'Roommate for Shared Condo - Northeast',
    description: 'I am looking for a roommate to share a beautiful condo in the northeast. Great facilities including pool, gym, and BBQ area. The condo is near shopping malls and has excellent connectivity.',
    location: 'Northeast',
    type: 'roommate',
    gender: 'Any',
    price: 1100,
    amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Pool', 'BBQ Area', 'Near MRT']
  },
  {
    title: 'Simple Room near University - North',
    description: 'Perfect for students! Walking distance to university campus, libraries, and food courts. Utilities included in rent. Study-friendly environment with desk and good lighting.',
    location: 'North',
    type: 'room',
    gender: 'Any',
    price: 550,
    amenities: ['WiFi', 'Near University', 'Utilities Included', 'Study Desk']
  },
  {
    title: 'Female Roommate - South Coast Living',
    description: 'Beautiful seaside location with stunning views. Looking for a female roommate who enjoys outdoor activities and beach lifestyle. The apartment has a spacious balcony perfect for morning coffee.',
    location: 'South',
    type: 'roommate',
    gender: 'Female',
    price: 1050,
    amenities: ['WiFi', 'Air Conditioning', 'Sea View', 'Near Beach', 'Balcony']
  },
  {
    title: 'Master Bedroom with Ensuite - Northwest',
    description: 'Spacious master bedroom with private bathroom. Modern HDB flat with all amenities nearby. Suitable for working professionals. Kitchen is shared but bedroom has private entrance.',
    location: 'Northwest',
    type: 'room',
    gender: 'Any',
    price: 900,
    amenities: ['WiFi', 'Air Conditioning', 'Ensuite Bathroom', 'Furnished', 'Near MRT']
  },
  {
    title: 'Looking for Chill Roommate - Southeast',
    description: 'Laid-back environment for working professionals. I travel frequently so you will have the place mostly to yourself. Must be clean and responsible. Looking for someone long-term.',
    location: 'Southeast',
    type: 'roommate',
    gender: 'Any',
    price: 850,
    amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Quiet Area', 'Near MRT']
  }
];

module.exports = sampleListings;
