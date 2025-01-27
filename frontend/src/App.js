import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Import BrowserRouter, Routes, and Route
import SignUpPage from './page/Signup';  // Import Signup component
import LoginPage from './page/Login';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import HomePage from './page/Homepage';
import ProtectedRoute from './page/ProtectedRoute';
import ProfilePage from './page/ProfilePage';
import PrivacyDoc from './page/PrivacyDoc';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true); // State for toggling light and dark mode

  const toggleMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <BrowserRouter> 
      <Routes>  
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/" element={<SignUpPage />} />  
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacydoc" element={<PrivacyDoc />} />
        <Route path="/profile" element={<ProfilePage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
