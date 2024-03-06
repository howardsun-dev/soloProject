// const { Router } = require('express');
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
  return res.send('Hello world from express Router!');
});

router.get('/weather', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    /* axios as structure of 
            data
            status (http code)
            statusText (OK/NotFound)
            headers
            config
            request 
     */
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
    );

    const data = response.data;

    return res.json(data);
  } catch (error) {
    next({
        log: `Weather middleware had an error occur: ${error}`,
        status: 500,
        message: { err: 'An error occured getting weather, check logs for details' },
    })
  }
});

module.exports = router;
