// const { Router } = require('express');
const express = require('express');
const weatherController = require('../controllers/weatherController');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('Hello world from express Router!');
});

router.get('/weather', weatherController.getWeather, async (req, res) => {
  res.status(200).json(res.locals.weatherData);
});

module.exports = router;
