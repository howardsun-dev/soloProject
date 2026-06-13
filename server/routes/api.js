const express = require('express');
const weatherController = require('../controllers/weatherController');
const hotelController = require('../controllers/hotelController');
const itineraryController = require('../controllers/itineraryController');

const router = express.Router();

router.get('/', (req, res) => {
  return res.send('Hello world from express Router!');
});

// Weather endpoint
router.get('/weather', weatherController.getWeather, async (req, res) => {
  res.status(200).json(res.locals.weatherData);
});

// Hotels endpoint
router.get('/hotels', hotelController.getHotels, async (req, res) => {
  res.status(200).json(res.locals.hotelData);
});

// Itinerary endpoint
router.post('/itinerary', itineraryController.generateItinerary, async (req, res) => {
  res.status(200).json({ itinerary: res.locals.itinerary });
});

module.exports = router;