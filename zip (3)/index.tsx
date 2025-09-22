import React from 'react';
import ReactDOM from 'react-dom/client';
// Assuming a global CSS file for TailwindCSS setup exists.
// If not, you would need to create it and include Tailwind directives.
// import './index.css'; 
import App from './App';
import { ReportProvider } from './contexts/ReportContext';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ReportProvider>
        <App />
      </ReportProvider>
    </AuthProvider>
  </React.StrictMode>
);
