import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import SignUpPage from './page/Signup';  
import LoginPage from './page/Login';
import HomePage from './page/Homepage';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import PrivacyDoc from './page/PrivacyDoc';
function App() {

  return (
    <BrowserRouter> 
      <Routes>  
        <Route path="/" element={<LoginPage />} />  
        <Route path="/signup" element={<SignUpPage />} />  
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacydoc" element={<PrivacyDoc />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App;
