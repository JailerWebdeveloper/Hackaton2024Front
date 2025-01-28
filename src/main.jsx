import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './Core/Routes/appRoutes';
import "./index.css"
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster position="top-center" richColors />
    <AppRoutes />
  </React.StrictMode>,
);
