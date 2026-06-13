import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

interface CardsProps {
  weatherData: WeatherData;
  locationName?: string;
}

interface DailySummaryItem {
  date: string;
  high: number;
  low: number;
  precipitation: number;
  weatherCode: number;
}

const Cards = ({ weatherData, locationName }: CardsProps) => {
  if (!weatherData || !weatherData.current) {
    return null;
  }

  const [isModalOpen, setModalOpen] = useState(false);

  const { current, hourly, daily } = weatherData;
  const { time, temperature_2m, wind_speed_10m } = current;
  const timeGMT = time.concat('Z');
  const labels: string[] = hourly.time.map((element: string) => {
    const date = new Date(element + 'Z');
    return date.toLocaleString();
  });

  const toggleModal = () => setModalOpen(!isModalOpen);

  const data: ChartData<'line' | 'bar'> = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Temperature 2m (°F)',
        data: hourly.temperature_2m,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Wind Speed 10m (mp/h)',
        data: hourly.wind_speed_10m,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
      {
        type: 'line',
        label: 'Temperature 80m (°F)',
        data: hourly.temperature_80m,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Precipitation (inch)',
        data: hourly.precipitation,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        yAxisID: 'y2',
      },
    ],
  };

  const options: ChartOptions<'line' | 'bar'> = {
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear',
        display: false,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const readableTime = new Date(timeGMT).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  // Daily summary for quick view
  const dailySummary: DailySummaryItem[] = daily
    ? daily.time.map((date: string, i: number) => ({
        date,
        high: daily.temperature_2m_max[i],
        low: daily.temperature_2m_min[i],
        precipitation: daily.precipitation_sum[i],
        weatherCode: daily.weathercode[i],
      }))
    : [];

  const getWeatherDescription = (code: number): string => {
    const codes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return codes[code] || 'Unknown';
  };

  return (
    <div className="card-container">
      <div className="card">
        <div className="card-header">
          {locationName && <h3 className="location-title">{locationName}</h3>}
          <p>Last Update: {readableTime}</p>
          <p>Temperature (2m): {temperature_2m} °F</p>
          <p>Wind Speed: {wind_speed_10m} mp/h</p>
          <a href="#" className="view-chart-link" onClick={toggleModal}>
            View Hourly Chart
          </a>
        </div>

        {dailySummary.length > 0 && (
          <div className="daily-summary">
            <h4>7-Day Forecast</h4>
            <div className="daily-cards">
              {dailySummary.slice(0, 7).map((day: DailySummaryItem, i: number) => (
                <div key={i} className="daily-card">
                  <span className="daily-date">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="daily-weather">{getWeatherDescription(day.weatherCode)}</span>
                  <span className="daily-temps">
                    <span className="high">{day.high}°</span>
                    <span className="low">{day.low}°</span>
                  </span>
                  {day.precipitation > 0 && (
                    <span className="daily-precip">💧 {day.precipitation}in</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isModalOpen && <Chart type="bar" data={data} options={options} />}
      </div>
    </div>
  );
};

export default Cards;