import React, { useState, useEffect, FormEvent } from 'react';
import Cards from '../components/Cards';
import TextBox from '../components/TextBox';
import HotelList from '../components/HotelList';
import Itinerary from '../components/Itinerary';
import axios from 'axios';

interface Coordinates {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    temperature_80m: number[];
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weathercode: number[];
  };
}

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

const MainContainer = () => {
  const [location, setLocation] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hotelData, setHotelData] = useState<Hotel[] | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [activeTab, setActiveTab] = useState<'weather' | 'hotels' | 'itinerary'>('weather');

  // Geocode location to coordinates
  const geocodeLocation = async (locationName: string): Promise<Coordinates> => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon), displayName: display_name };
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to find location. Please try a more specific name.');
    }
  };

  // Fetch weather data
  const fetchWeather = async (
    latitude: number,
    longitude: number,
    checkInDate: string,
    checkOutDate: string
  ): Promise<WeatherData> => {
    try {
      const response = await axios.get(
        `/api/weather?latitude=${latitude}&longitude=${longitude}&checkIn=${checkInDate}&checkOut=${checkOutDate}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Error fetching weather data. Please try again later.');
    }
  };

  // Fetch hotel data
  const fetchHotels = async (
    latitude: number,
    longitude: number,
    checkInDate: string,
    checkOutDate: string
  ): Promise<Hotel[]> => {
    try {
      const response = await axios.get(
        `/api/hotels?latitude=${latitude}&longitude=${longitude}&checkIn=${checkInDate}&checkOut=${checkOutDate}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      throw new Error('Error fetching hotel data. Please try again later.');
    }
  };

  // Generate itinerary using AI
  const generateItinerary = async (
    weatherData: WeatherData,
    hotelData: Hotel[],
    locationName: string,
    checkInDate: string,
    checkOutDate: string
  ): Promise<ItineraryDay[]> => {
    try {
      const response = await axios.post('/api/itinerary', {
        weatherData,
        hotelData,
        locationName,
        checkIn: checkInDate,
        checkOut: checkOutDate,
      });
      return response.data.itinerary;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw new Error('Error generating itinerary. Please try again later.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!location || !checkIn || !checkOut) {
      setError('Please fill in all fields');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setError(null);
    setLoading(true);
    setWeatherData(null);
    setHotelData(null);
    setItinerary(null);

    try {
      // Step 1: Geocode location
      const coords = await geocodeLocation(location);
      setCoordinates(coords);

      // Step 2: Fetch weather and hotels in parallel
      const [weather, hotels] = await Promise.all([
        fetchWeather(coords.latitude, coords.longitude, checkIn, checkOut),
        fetchHotels(coords.latitude, coords.longitude, checkIn, checkOut),
      ]);

      setWeatherData(weather);
      setHotelData(hotels);

      // Step 3: Generate itinerary
      const aiItinerary = await generateItinerary(weather, hotels, coords.displayName, checkIn, checkOut);
      setItinerary(aiItinerary);

      setActiveTab('weather');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Set default dates on mount
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    if (!checkIn) setCheckIn(formatDate(tomorrow));
    if (!checkOut) setCheckOut(formatDate(dayAfterTomorrow));
  }, [checkIn, checkOut]);

  return (
    <div className="form-container">
      {error && <p className="error">{error}</p>}

      <TextBox
        handleSubmit={handleSubmit}
        location={location}
        setLocation={setLocation}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
      />

      {loading && <p className="loading">Planning your trip...</p>}

      {(weatherData || hotelData || itinerary) && (
        <div className="results-container">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'weather' ? 'active' : ''}`}
              onClick={() => setActiveTab('weather')}
              disabled={!weatherData}
            >
              Weather
            </button>
            <button
              className={`tab-button ${activeTab === 'hotels' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotels')}
              disabled={!hotelData}
            >
              Hotels
            </button>
            <button
              className={`tab-button ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
              disabled={!itinerary}
            >
              Itinerary
            </button>
          </div>

          {activeTab === 'weather' && weatherData && (
            <Cards weatherData={weatherData} locationName={coordinates?.displayName} />
          )}

          {activeTab === 'hotels' && hotelData && (
            <HotelList hotels={hotelData} checkIn={checkIn} checkOut={checkOut} />
          )}

          {activeTab === 'itinerary' && itinerary && (
            <Itinerary itinerary={itinerary} locationName={coordinates?.displayName} />
          )}
        </div>
      )}
    </div>
  );
};

export default MainContainer;