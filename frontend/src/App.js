import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons
import SignUpPage from './page/Signup';
import LoginPage from './page/Login';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import HomePage from './page/Homepage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true); // State for toggling light and dark mode

  const toggleMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <Router>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <button onClick={toggleMode} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          {isDarkMode ? <FaSun color="#FFD700" size={24} /> : <FaMoon color="#4B0082" size={24} />}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<SignUpPage isDarkMode={isDarkMode} />} />
        <Route path="/login" element={<LoginPage isDarkMode={isDarkMode} toggleMode={toggleMode}/>} />
        <Route path="/forgot-password" element={<ForgotPassword isDarkMode={isDarkMode} />} />
        <Route path="/reset-password" element={<ResetPassword isDarkMode={isDarkMode} />} />
        <Route path="/home" element={<HomePage isDarkMode={isDarkMode}/>} />
      </Routes>
    </Router>
  );
}

export default App;