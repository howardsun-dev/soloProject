const axios = require('axios');

const weatherController = {};

weatherController.getWeather = async (req, res, next) => {
  try {
    const { latitude, longitude, checkIn, checkOut } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Coordinates required' });
    }

    // Build the Open-Meteo API URL with daily forecast
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: 'temperature_2m,wind_speed_10m',
      hourly: 'temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,temperature_80m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
      precipitation_unit: 'inch',
      timezone: 'auto',
    });

    // Add date range if provided
    if (checkIn) params.append('start_date', checkIn);
    if (checkOut) params.append('end_date', checkOut);

    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`
    );

    res.locals.weatherData = response.data;

    return next();
  } catch (error) {
    return next({
      log: `weatherController.getWeather had an error occur: ${error}`,
      status: 500,
      message: {
        err: 'An error occured getting weather, check logs for details',
      },
    });
  }
};

module.exports = weatherController;