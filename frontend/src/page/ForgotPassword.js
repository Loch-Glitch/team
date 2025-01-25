import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword({ isDarkMode }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/request-password-reset-otp/', { email });

      if (response.status === 200) {
        setIsOtpSent(true);
        setErrorMessage('');
      } else {
        setErrorMessage(response.data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Please enter the OTP.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/verify-password-reset-otp/', { email, otp });

      if (response.status === 200) {
        navigate('/reset-password', { state: { email } });
      } else {
        setErrorMessage(response.data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleBack = () => navigate('/');

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: isDarkMode ? '#282c34' : '#f0f0f0',
      color: isDarkMode ? '#ffffff' : '#000000',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    },
    header: {
      fontSize: '2.5rem',
      color: isDarkMode ? '#61dafb' : '#333',
      marginBottom: '20px',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '400px',
      marginBottom: '20px',
    },
    input: {
      padding: '12px',
      margin: '10px 0',
      border: `1px solid ${isDarkMode ? '#61dafb' : '#ccc'}`,
      borderRadius: '5px',
      fontSize: '1rem',
      backgroundColor: isDarkMode ? '#3a3f47' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      transition: 'border-color 0.3s ease',
    },
    signupButton: {
      backgroundColor: isDarkMode ? '#61dafb' : '#4CAF50',
      color: isDarkMode ? '#282c34' : '#ffffff',
      border: 'none',
      borderRadius: '5px',
      padding: '15px 0',
      fontSize: '1rem',
      width: '100%',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      marginTop: '10px',
    },
    footerButton: {
      backgroundColor: 'transparent',
      color: isDarkMode ? '#61dafb' : '#4CAF50',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      textDecoration: 'underline',
      marginTop: '20px',
    },
    otpInput: {
      padding: '12px',
      margin: '10px 0',
      border: `1px solid ${isDarkMode ? '#61dafb' : '#ccc'}`,
      borderRadius: '5px',
      fontSize: '1rem',
      backgroundColor: isDarkMode ? '#3a3f47' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      transition: 'border-color 0.3s ease',
    },
    errorMessage: {
      color: 'red',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Forgot Password</h1>
      <div style={styles.formContainer}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSendOtp} style={styles.signupButton}>
          Send OTP
        </button>
      </div>

      {isOtpSent && (
        <div style={styles.formContainer}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.otpInput}
          />
          <button onClick={handleVerifyOtp} style={styles.signupButton}>
            Verify OTP
          </button>
        </div>
      )}

      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

      <button onClick={handleBack} style={styles.footerButton}>
        Back
      </button>
    </div>
  );
}

export default ForgotPassword;