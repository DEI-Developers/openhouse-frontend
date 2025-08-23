import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  // Comentado temporalmente para evitar doble ejecución de efectos en desarrollo
  // <StrictMode>
    <App />
  // </StrictMode>
);
