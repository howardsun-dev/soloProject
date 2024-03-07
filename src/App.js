import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import MainContainer from './containers/MainContainer';
import logo from './assets/images/logo.png';
import './styles.scss';

// const logo = lazy(() => import('./assets/images/logo.png'))

const App = () => {
  return (
    <div>
      <header>
        <h1><center><img src={logo} alt='Logo' height={400} width={400}/></center></h1>
      </header>
      <MainContainer />
    </div>
  );
};

export default App;
