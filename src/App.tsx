import React, { useEffect, useState } from 'react';
// import MainContainer from './containers/MainContainer';
import logo from './assets/images/logo.png';
import './styles.scss';

const App = () => {
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className={`container ${fadeIn ? 'fade-in' : ''}`}>
      <header>
        <img
          src={logo}
          alt="logo"
          height={400}
          width={400}
          className="logo-animation"
          loading="lazy"
        />
      </header>
      {/* <MainContainer /> */}
    </div>
  );
};

export default App;
