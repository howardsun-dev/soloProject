import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.scss';

const App = () => {
  return (
    <div>
      <h1>Hello world!</h1>
      <h2>Automatic render using createRoot</h2>
    </div>
  );
};

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
