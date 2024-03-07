// const { Router } = require('express');
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
  return res.send('Hello world from express Router!');
});

router.get('/weather', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    // console.log(req.body)

    console.log('This is the Location', latitude, longitude);
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

    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,temperature_80m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`
    );

    const data = response.data;

    return res.json(data);
  } catch (error) {
    next({
      log: `Weather middleware had an error occur: ${error}`,
      status: 500,
      message: {
        err: 'An error occured getting weather, check logs for details',
      },
    });
  }
});

module.exports = router;
