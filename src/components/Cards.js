import React from 'react';
import { Line, Bar } from 'react-chartjs-2';

const Cards = ({ weatherData }) => {
  if (!weatherData || !weatherData.current) {
    // If weatherData or weatherData.current is null, you can return a loading message or null
    return null; // Or return null to render nothing
  }

  const { current, hourly } = weatherData;
  const { time, temperature_2m, wind_speed_10m } = current;
  const timeGMT = time.concat('Z');

  const readableTime = new Date(timeGMT).toLocaleString('en-US', {
    timeZone: 'America/New_York', // This will use Eastern Time, accounting for EST and EDT
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  // console.log(weatherData);

  return (
    <div className="card-container">
      <div className="card">
        <p>Last Update: {readableTime}</p>
        <p>Temperature (2m): {temperature_2m} °F</p>
        <p>Wind Speed: {wind_speed_10m} in</p>
      </div>
    </div>
  );
};

export default Cards;
