import './App.css';
import {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import AppRouter from './Router';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRouter />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
