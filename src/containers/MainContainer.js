/**
 * ************************************
 *
 * @module  MainContainer
 * @author
 * @date
 * @description
 *
 * ************************************
 */

import React, { useState, useEffect } from 'react';
import Cards from '../components/Cards';
import axios from 'axios';

const MainContainer = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  //   const handleInput = (e) => {
  //     const { name, value } = e.target;
  //     if (name === latitude) {
  //       setLatitude(value);
  //     } else if (name === longitude) {
  //       setLongitude(value);
  //     }
  //   };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `/api/weather?latitude=${latitude}&longitude=${longitude}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data: ', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <button type="submit">Fetch Weather</button>
      </form>
    </div>
  );
};

export default MainContainer;
