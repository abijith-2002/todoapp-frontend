import React from 'react';
import ReactDOM from 'react-dom/client';
// Inter font is loaded via <link> in public/index.html for Google Fonts
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
