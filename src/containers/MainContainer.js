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
import TextBox from '../components/TextBox';
import axios from 'axios';

const MainContainer = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState(null);
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
      setError('Error fetching weather data. Please try again later.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      setError('Please enter both latitude and longitude');
      return;
    }

    fetchWeather();
  };

  return (
    <div className="form-container">
      {error && <p className="error">{error}</p>}{' '}
      {/* Conditionally display an error message */}
      <TextBox
        handleSubmit={handleSubmit}
        longitude={longitude}
        setLongitude={setLongitude}
        latitude={latitude}
        setLatitude={setLatitude}
      />
      <Cards weatherData={weatherData} />
    </div>
  );
};

export default MainContainer;
