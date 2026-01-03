
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { logger } from './services/systemLogger';

// Side effect: initializes system logging
console.log("MindArc initializing...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
