import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import PWAInstallBanner from './components/PWAInstallBanner';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <PWAInstallBanner />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

