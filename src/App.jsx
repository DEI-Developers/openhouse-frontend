// @ts-nocheck
import './App.css';
import {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import ErrorBoundary from '@pages/ErrorBoundary';
import {AuthProvider} from '@context/AuthContext';
import {HelmetProvider} from 'react-helmet-async';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppRouter from './Router';

const queryClient = new QueryClient();
const basePath = import.meta.env.VITE_BASE_PATH || '/';

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter basename={basePath}>
          <Suspense fallback={<div>Loading...</div>}>
            <QueryClientProvider client={queryClient}>
              <ErrorBoundary>
                <AppRouter />
              </ErrorBoundary>
            </QueryClientProvider>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
