import React from 'react';

const TextBox = ({
  handleSubmit,
  longitude,
  setLongitude,
  latitude,
  setLatitude,
}) => {
  return (
    <div className="textbox-container">
      <form onSubmit={handleSubmit}>
        <input
          className="rounded-input"
          type="text"
          placeholder="Enter Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <input
          className="rounded-input"
          type="text"
          placeholder="Enter Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <br />
        <center>
          <button className="rounded-button" type="submit">
            Fetch Weather
          </button>
        </center>
      </form>
    </div>
  );
};

export default TextBox;
