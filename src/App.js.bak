import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import MainContainer from './containers/MainContainer';
import logo from './assets/images/logo.png';
import './styles.scss';

// const logo = lazy(() => import('./assets/images/logo.png'))

const App = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true); // Triggers the fade-in effect on component mount
  }, []);

  return (
    <div className={`container ${fadeIn ? 'fade-in' : ''}`}>
      <header>
        <h1>
          <img
            src={logo}
            alt="Logo"
            height={400}
            width={400}
            className="logo-animation"
            loading="lazy" // this enables lazy loading natively from the browser
          />
        </h1>
      </header>
      <MainContainer />
    </div>
  );
};

export default App;
