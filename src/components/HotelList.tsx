import React from 'react';

interface Hotel {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  totalPrice: number;
  amenities: string[];
  image: string;
}

interface HotelListProps {
  hotels: Hotel[];
  checkIn: string;
  checkOut: string;
}

const HotelList = ({ hotels, checkIn, checkOut }: HotelListProps) => {
  if (!hotels || !hotels.length) {
    return <div className="no-results">No hotels found for the selected dates.</div>;
  }

  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="hotel-list-container">
      <div className="hotel-summary">
        <h3>{hotels.length} Hotels Found</h3>
        <p>{nights} night{nights === 1 ? '' : 's'} • {checkIn} to {checkOut}</p>
      </div>

      <div className="hotel-cards">
        {hotels.map((hotel: Hotel, index: number) => (
          <div key={hotel.id || index} className="hotel-card">
            <div className="hotel-image">
              {hotel.image ? (
                <img src={hotel.image} alt={hotel.name} />
              ) : (
                <div className="placeholder-image">🏨</div>
              )}
            </div>
            <div className="hotel-info">
              <h4>{hotel.name}</h4>
              <p className="hotel-address">{hotel.address}</p>
              {hotel.rating && (
                <div className="hotel-rating">
                  <span className="stars">{"★".repeat(Math.floor(hotel.rating))}</span>
                  <span className="rating-value">{hotel.rating}/10</span>
                  <span className="review-count">({hotel.reviewCount} reviews)</span>
                </div>
              )}
              <div className="hotel-amenities">
                {hotel.amenities?.slice(0, 4).map((amenity: string, i: number) => (
                  <span key={i} className="amenity-tag">{amenity}</span>
                ))}
              </div>
            </div>
            <div className="hotel-pricing">
              <div className="price-per-night">
                <span className="price">${hotel.pricePerNight}</span>
                <span className="per-night">/night</span>
              </div>
              <div className="total-price">
                <span className="label">Total</span>
                <span className="total">${hotel.totalPrice}</span>
              </div>
              <button className="book-button">Select</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelList;