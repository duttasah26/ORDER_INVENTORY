import React from 'react';
import ReactDOM from 'react-dom/client';
import '@shared/styles/variables.css';
import '@shared/styles/globals.css';
import '@shared/styles/theme.css';
import AppProviders from './providers';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
