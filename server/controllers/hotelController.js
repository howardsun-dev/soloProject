const axios = require('axios');

const hotelController = {};

/**
 * Mock hotel data generator for development/demo
 * In production, replace with real hotel API (Amadeus, Booking.com, etc.)
 */
const generateMockHotels = (latitude, longitude, checkIn, checkOut) => {
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  const basePrice = 80 + Math.random() * 200; // $80-$280 per night

  const hotelNames = [
    'Grand Plaza Hotel',
    'Riverside Inn',
    'City Center Suites',
    'Garden View Hotel',
    'Metropolitan Resort',
    'Harbor Light Hotel',
    'Park Avenue Lodge',
    'Sunset Boulevard Hotel',
    'Downtown Express',
    'Luxury Tower Hotel',
  ];

  const amenities = [
    'Free WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar',
    'Room Service', 'Parking', 'Airport Shuttle', 'Business Center',
    'Laundry', 'Pet Friendly', 'Rooftop Terrace', 'Concierge'
  ];

  return hotelNames.slice(0, 5 + Math.floor(Math.random() * 5)).map((name, index) => {
    const pricePerNight = Math.round(basePrice + (Math.random() - 0.5) * 50);
    const rating = (3.5 + Math.random() * 1.5).toFixed(1);
    const reviewCount = Math.floor(100 + Math.random() * 2000);
    const hotelAmenities = amenities.sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 4));

    return {
      id: `hotel_${index}`,
      name,
      address: `${Math.floor(100 + Math.random() * 900)} Main Street, City Center`,
      latitude: latitude + (Math.random() - 0.5) * 0.02,
      longitude: longitude + (Math.random() - 0.5) * 0.02,
      rating: parseFloat(rating),
      reviewCount,
      pricePerNight,
      totalPrice: pricePerNight * nights,
      amenities: hotelAmenities,
      image: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&sig=${index}`,
    };
  });
};

hotelController.getHotels = async (req, res, next) => {
  try {
    const { latitude, longitude, checkIn, checkOut } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Coordinates required' });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: 'Check-in and check-out dates required' });
    }

    // TODO: Replace with real hotel API integration
    // Example with Amadeus:
    // const token = await getAmadeusToken();
    // const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode', {
    //   headers: { Authorization: `Bearer ${token}` },
    //   params: { latitude, longitude, checkInDate: checkIn, checkOutDate: checkOut }
    // });

    const hotels = generateMockHotels(
      parseFloat(latitude),
      parseFloat(longitude),
      checkIn,
      checkOut
    );

    res.locals.hotelData = hotels;

    return next();
  } catch (error) {
    console.error('Hotel controller error:', error);
    return next({
      log: `hotelController.getHotels had an error: ${error}`,
      status: 500,
      message: { err: 'An error occurred fetching hotels' },
    });
  }
};

module.exports = hotelController;