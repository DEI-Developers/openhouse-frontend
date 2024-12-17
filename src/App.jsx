import './App.css';
import {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppRouter from './Router';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <QueryClientProvider client={queryClient}>
            <AppRouter />
          </QueryClientProvider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
