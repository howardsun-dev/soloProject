import React, { useState } from 'react';

interface ItineraryDay {
  date: string;
  weather: {
    high: number;
    low: number;
    description: string;
  };
  morning: string;
  afternoon: string;
  evening: string;
  tips: string;
}

interface ItineraryProps {
  itinerary: ItineraryDay[] | string;
  locationName?: string;
}

const Itinerary = ({ itinerary, locationName }: ItineraryProps) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  if (!itinerary) {
    return <div className="no-results">No itinerary generated yet.</div>;
  }

  return (
    <div className="itinerary-container">
      <div className="itinerary-header">
        <h3>Your {locationName} Itinerary</h3>
        <p className="itinerary-subtitle">AI-generated based on weather forecast</p>
      </div>

      {Array.isArray(itinerary) ? (
        itinerary.map((day: ItineraryDay, index: number) => (
          <div key={index} className="itinerary-day">
            <div
              className="day-header"
              onClick={() => setExpandedDay(expandedDay === index ? null : index)}
            >
              <div className="day-info">
                <span className="day-number">Day {index + 1}</span>
                <span className="day-date">{day.date}</span>
                <span className="day-weather">
                  {day.weather?.description} • {day.weather?.high}°/{day.weather?.low}°F
                </span>
              </div>
              <span className="expand-icon">
                {expandedDay === index ? '▲' : '▼'}
              </span>
            </div>

            {expandedDay === index && (
              <div className="day-details">
                {day.morning && (
                  <div className="activity-block">
                    <h5>🌅 Morning</h5>
                    <p>{day.morning}</p>
                  </div>
                )}
                {day.afternoon && (
                  <div className="activity-block">
                    <h5>☀️ Afternoon</h5>
                    <p>{day.afternoon}</p>
                  </div>
                )}
                {day.evening && (
                  <div className="activity-block">
                    <h5>🌙 Evening</h5>
                    <p>{day.evening}</p>
                  </div>
                )}
                {day.tips && (
                  <div className="day-tips">
                    <h5>💡 Tips</h5>
                    <p>{day.tips}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        // If itinerary is a string (markdown/text)
        <div className="itinerary-text">{itinerary}</div>
      )}
    </div>
  );
};

export default Itinerary;