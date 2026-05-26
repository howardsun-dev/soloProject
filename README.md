# Travel Cast

Travel Cast is a full-stack weather dashboard that fetches forecast data for a latitude/longitude pair and displays it in a React UI.

The project combines a React + TypeScript frontend, an Express backend, and the Open-Meteo API. It was built as a solo project to practice full-stack application structure, API proxying, chart-ready weather data, and Webpack-based React development.

## Features

- Latitude/longitude weather lookup
- Express API route for backend weather requests
- Open-Meteo forecast integration
- React UI for user input and weather display
- TypeScript React entry point
- SCSS styling
- Webpack development and production builds
- Sample weather data for reference/local development

## Tech stack

- React
- TypeScript
- Express
- Axios
- Open-Meteo API
- Chart.js / React Chart.js
- Sass / SCSS
- Webpack
- Nodemon

## Repository structure

```text
.
├── server/
│   ├── server.js                    # Express server entry point
│   ├── configurePath.js             # Static/path configuration
│   ├── routes/api.js                # API routes
│   └── controllers/weatherController.js
├── src/
│   ├── components/                  # UI components
│   ├── containers/MainContainer.js  # Weather form/data container
│   ├── App.tsx                      # Root React component
│   ├── index.tsx                    # Frontend entry point
│   ├── index.html                   # HTML template
│   └── styles.scss                  # Application styles
├── sampleWeatherData.json
├── webpack.config.js
├── tsconfig.json
└── package.json
```

## Getting started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

This starts the Express server with Nodemon and the Webpack dev server in development mode.

### Build for production

```bash
npm run build
```

### Run production server

```bash
npm start
```

## API

### `GET /api/weather`

Fetches weather data from Open-Meteo for a latitude/longitude pair.

Example:

```text
/api/weather?latitude=41.875&longitude=-72.875
```

Query parameters:

- `latitude` — required
- `longitude` — required

The backend validates that both coordinates are present, then proxies the request to Open-Meteo.

## Project status

This is a solo learning project and portfolio artifact. It demonstrates full-stack React/Express structure and third-party API integration, but it is not currently deployed as a production service.

## License

No license has been specified for this repository yet.
