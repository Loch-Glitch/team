import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Import BrowserRouter, Routes, and Route
import App from './App';
import SignUpPage from './page/Signup';  // Import Signup component
import LoginPage from './page/Login';
import HomePage from './page/Homepage';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import PrivacyDoc from './page/PrivacyDoc';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Wrap your app with BrowserRouter */}
      <Routes>  {/* Define the routes */}
        <Route path="/" element={<App />} />  {/* Set the main route to render App */}
        <Route path="/login" element={<LoginPage />} />  {/* Define the route for login */}
        <Route path="/signup" element={<SignUpPage />} />  {/* Define the route for Signup */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacydoc" element={<PrivacyDoc />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);