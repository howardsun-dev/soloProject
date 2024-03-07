const axios = require('axios');

const weatherController = {};

weatherController.getWeather = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;
    console.log(req.body);

    console.log('This is the Location 📍', latitude, longitude);
    /* axios as structure of 
                data
                status (http code)
                statusText (OK/NotFound)
                headers
                config
                request 
         */

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Coordinates required' });
    }
    // https://api.open-meteo.com/v1/forecast?latitude=41.875&longitude=72.875&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,temperature_80m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,temperature_80m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`
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
