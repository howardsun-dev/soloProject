import React from 'react';
import { createRoot } from 'react-dom/client';
import MainContainer from './containers/MainContainer';
import './styles.scss';

const App = () => {
  return (
    <div>
      <h1>Weather Travel App</h1>
      <MainContainer />
    </div>
  );
};

export default App;
