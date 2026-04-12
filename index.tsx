import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider } from './components/QueryProvider';
import './index.css';
import App from './App';
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </HelmetProvider>
  </React.StrictMode>
);