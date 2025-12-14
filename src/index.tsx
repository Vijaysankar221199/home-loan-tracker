import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const container = document.getElementById('root') || document.createElement('div');
container.id = 'root';
if (!document.body.contains(container)) document.body.appendChild(container);

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
