import './App.css';
import {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from '@context/AuthContext';
import {HelmetProvider} from 'react-helmet-async';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppRouter from './Router';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <QueryClientProvider client={queryClient}>
              <AppRouter />
            </QueryClientProvider>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
