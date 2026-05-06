import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { DependenciesProvider } from './context/DependenciesProvider.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './shared/ui/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DependenciesProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DependenciesProvider>
    </BrowserRouter>
  </StrictMode>
);
