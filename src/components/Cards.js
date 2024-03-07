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

const Cards = ({ weatherData }) => {
  if (!weatherData || !weatherData.current) {
    // If weatherData or weatherData.current is null, you can return a loading message or null
    return null; // Or return null to render nothing
  }
  // State to check of Modal is open or not
  const [isModalOpen, setModalOpen] = useState(false);

  const { current, hourly } = weatherData;
  const { time, temperature_2m, wind_speed_10m } = current;
  const timeGMT = time.concat('Z');
  const labels = hourly.time.map((element) =>
    element.concat('Z').toLocaleString()
  );

  const toggleModal = () => [setModalOpen(!isModalOpen)];

  const data = {
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

  const options = {
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
        <p>Wind Speed: {wind_speed_10m} mp/h</p>
        {/* <a href='#' onClick={toggleModal}>View Chart</a> */}
        {/* <Modal isOpen={isModalOpen} onClose={toggleModal}> */}
        <Chart type="line" data={data} options={options} />
        {/* </Modal> */}
      </div>
    </div>
  );
};

export default Cards;
