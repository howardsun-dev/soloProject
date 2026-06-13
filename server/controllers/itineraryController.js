const axios = require('axios');

const itineraryController = {};

/**
 * Generate itinerary using OpenAI API
 * Requires OPENAI_API_KEY in environment variables
 */
itineraryController.generateItinerary = async (req, res, next) => {
  try {
    const { weatherData, hotelData, locationName, checkIn, checkOut } = req.body;

    if (!weatherData || !locationName || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required data for itinerary generation' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Return a mock itinerary if no API key is configured
      const mockItinerary = generateMockItinerary(weatherData, hotelData, locationName, checkIn, checkOut);
      res.locals.itinerary = mockItinerary;
      return next();
    }

    // Build the prompt for OpenAI
    const prompt = buildItineraryPrompt(weatherData, hotelData, locationName, checkIn, checkOut);

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel planner. Create a day-by-day itinerary in JSON format based on the weather forecast and hotel options. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let itinerary;
    try {
      const content = response.data.choices[0].message.content;
      itinerary = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Fallback to mock itinerary
      itinerary = generateMockItinerary(weatherData, hotelData, locationName, checkIn, checkOut);
    }

    res.locals.itinerary = itinerary;
    return next();
  } catch (error) {
    console.error('Itinerary controller error:', error);
    // Fallback to mock itinerary on any error
    const mockItinerary = generateMockItinerary(
      req.body.weatherData,
      req.body.hotelData,
      req.body.locationName,
      req.body.checkIn,
      req.body.checkOut
    );
    res.locals.itinerary = mockItinerary;
    return next();
  }
};

/**
 * Build prompt for OpenAI based on weather and hotel data
 */
function buildItineraryPrompt(weatherData, hotelData, locationName, checkIn, checkOut) {
  const daily = weatherData.daily || {};
  const days = daily.time || [];
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  let weatherSummary = '';
  days.forEach((date, i) => {
    if (i >= nights) return;
    const high = daily.temperature_2m_max?.[i] ?? 'N/A';
    const low = daily.temperature_2m_min?.[i] ?? 'N/A';
    const precip = daily.precipitation_sum?.[i] ?? 0;
    const code = daily.weathercode?.[i] ?? 0;
    weatherSummary += `Day ${i + 1} (${date}): High ${high}°F, Low ${low}°F, Precipitation ${precip}in, Weather code ${code}\n`;
  });

  let hotelSummary = '';
  if (hotelData && hotelData.length > 0) {
    hotelSummary = 'Top hotel options:\n';
    hotelData.slice(0, 3).forEach((hotel, i) => {
      hotelSummary += `${i + 1}. ${hotel.name} - $${hotel.pricePerNight}/night, Rating: ${hotel.rating}/10, Amenities: ${hotel.amenities.join(', ')}\n`;
    });
  }

  return `
Create a ${nights}-day travel itinerary for ${locationName} (check-in: ${checkIn}, check-out: ${checkOut}).

Weather forecast:
${weatherSummary}

${hotelSummary}

Return a JSON array where each element represents a day with this structure:
{
  "date": "YYYY-MM-DD",
  "weather": { "high": number, "low": number, "description": "string" },
  "morning": "string - morning activity suggestion",
  "afternoon": "string - afternoon activity suggestion",
  "evening": "string - evening activity suggestion",
  "tips": "string - weather-appropriate tips"
}

Consider the weather when suggesting activities (e.g., indoor activities for rainy days, outdoor for clear days).
Return ONLY the JSON array, no extra text.
  `.trim();
}

/**
 * Generate a mock itinerary for development/demo when no OpenAI key is available
 */
function generateMockItinerary(weatherData, hotelData, locationName, checkIn, checkOut) {
  const daily = weatherData.daily || {};
  const days = daily.time || [];
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  const weatherDescriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
  };

  const indoorActivities = [
    'Visit a local museum or art gallery',
    'Explore a historic indoor market',
    'Take a cooking class featuring local cuisine',
    'Visit an aquarium or science center',
    'Enjoy a spa treatment at your hotel',
    'Go shopping at a covered mall or boutique district',
    'Take a wine/beer tasting tour',
    'Visit a historic palace or castle interior',
  ];

  const outdoorActivities = [
    'Take a walking tour of the historic district',
    'Visit a famous park or garden',
    'Explore a local outdoor market',
    'Take a scenic hike or nature walk',
    'Go on a bike tour of the city',
    'Visit a viewpoint or observation deck',
    'Take a boat tour or river cruise',
    'Enjoy a picnic in a scenic spot',
  ];

  const eveningActivities = [
    'Dine at a highly-rated local restaurant',
    'Enjoy drinks at a rooftop bar',
    'Attend a live music or theater performance',
    'Take an evening walking food tour',
    'Enjoy a sunset view from a scenic spot',
    'Visit a night market',
    'Try a speakeasy or craft cocktail bar',
    'Take a ghost or history night tour',
  ];

  return days.slice(0, nights).map((date, i) => {
    const high = daily.temperature_2m_max?.[i] ?? 70;
    const low = daily.temperature_2m_min?.[i] ?? 50;
    const precip = daily.precipitation_sum?.[i] ?? 0;
    const code = daily.weathercode?.[i] ?? 0;
    const isRainy = precip > 0.1 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);

    const morningActivity = isRainy
      ? indoorActivities[Math.floor(Math.random() * indoorActivities.length)]
      : outdoorActivities[Math.floor(Math.random() * outdoorActivities.length)];

    const afternoonActivity = isRainy
      ? indoorActivities[Math.floor(Math.random() * indoorActivities.length)]
      : outdoorActivities[Math.floor(Math.random() * outdoorActivities.length)];

    const eveningActivity = eveningActivities[Math.floor(Math.random() * eveningActivities.length)];

    let tip = '';
    if (isRainy) tip = 'Bring an umbrella and waterproof shoes. Consider indoor backup plans.';
    else if (high > 85) tip = 'Stay hydrated and wear sunscreen. Plan outdoor activities for morning/evening.';
    else if (low < 45) tip = 'Pack layers and a warm jacket for cooler evenings.';
    else tip = 'Perfect weather for exploring! Comfortable walking shoes recommended.';

    return {
      date,
      weather: {
        high,
        low,
        description: weatherDescriptions[code] || 'Partly cloudy',
      },
      morning: morningActivity,
      afternoon: afternoonActivity,
      evening: eveningActivity,
      tips: tip,
    };
  });
}

module.exports = itineraryController;