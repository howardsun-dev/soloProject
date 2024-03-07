import React from 'react';

const Cards = ({ weatherData }) => {
  if (!weatherData || !weatherData.current) {
    // If weatherData or weatherData.current is null, you can return a loading message or null
    return null; // Or return null to render nothing
  }

  const { current } = weatherData;
  const { time, temperature_2m, precipitation } = current;
  const readableTime = new Date(time).toLocaleString();

  // console.log(weatherData);

  return (
    <div className="card-container">
      <div className="card">
        <p>Current Time: {readableTime}</p>
        <p>Temperature (2m): {temperature_2m}</p>
        <p>Precipitation: {precipitation} in</p>
      </div>
    </div>
  );
};

export default Cards;
