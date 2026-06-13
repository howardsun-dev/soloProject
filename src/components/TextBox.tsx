import React, { FormEvent, ChangeEvent } from 'react';

interface TextBoxProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  location: string;
  setLocation: (value: string) => void;
  checkIn: string;
  setCheckIn: (value: string) => void;
  checkOut: string;
  setCheckOut: (value: string) => void;
}

const TextBox = ({
  handleSubmit,
  location,
  setLocation,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
}: TextBoxProps) => {
  // Set default dates to tomorrow and day after tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return (
    <div className="textbox-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="location">Destination (City, Address, or Landmark)</label>
          <input
            className="rounded-input"
            id="location"
            type="text"
            placeholder="e.g., Paris, France or Times Square, NYC"
            value={location}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="date-inputs">
          <div className="input-group">
            <label htmlFor="checkIn">Check-in Date</label>
            <input
              className="rounded-input"
              id="checkIn"
              type="date"
              min={formatDate(new Date())}
              value={checkIn || formatDate(tomorrow)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckIn(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="checkOut">Check-out Date</label>
            <input
              className="rounded-input"
              id="checkOut"
              type="date"
              min={checkIn || formatDate(tomorrow)}
              value={checkOut || formatDate(dayAfterTomorrow)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckOut(e.target.value)}
              required
            />
          </div>
        </div>

        <center>
          <button className="rounded-button submit-button" type="submit">
            Plan My Trip
          </button>
        </center>
      </form>
    </div>
  );
};

export default TextBox;