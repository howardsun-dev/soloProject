import React, { useEffect, useState, lazy, Suspense } from 'react';
import MainContainer from './containers/MainContainer';
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
        <Suspense fallback={<div>Loading...</div>}>
          <img
            src={logo}
            alt="logo"
            height={400}
            width={400}
            className="logo-animation"
            loading="lazy"
          />
        </Suspense>
      </header>
      <MainContainer />
    </div>
  );
};

//test commit

export default App;
