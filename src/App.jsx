import './App.css';
import {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import AppRouter from './Router';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouter />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
