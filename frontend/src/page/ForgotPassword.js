import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Function to send OTP request
  const handleSendOtp = async () => {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/request-password-reset-otp/', {
        email: email
      });

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
  // Function to verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Please enter the OTP.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/verify-password-reset-otp/', {
        email,
        otp
      });

      if (response.status === 200) {
        navigate('/reset-password', { state: { email } });
      } else {
        setErrorMessage(response.data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
};
  // Function to navigate back to home
  const handleBack = () => navigate('/');

  // Styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#121212',
      color: '#f0f0f0',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    },
    header: {
      fontSize: '2.5rem',
      color: '#ff6f61',
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
      border: '1px solid #444',
      borderRadius: '5px',
      fontSize: '1rem',
      backgroundColor: '#1c1c1c',
      color: '#f0f0f0',
      transition: 'border-color 0.3s ease',
    },
    signupButton: {
      backgroundColor: '#ff6f61',
      color: '#fff',
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
      color: '#ff6f61',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      textDecoration: 'underline',
      marginTop: '20px',
    },
    otpInput: {
      padding: '12px',
      margin: '10px 0',
      border: '1px solid #444',
      borderRadius: '5px',
      fontSize: '1rem',
      backgroundColor: '#1c1c1c',
      color: '#f0f0f0',
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
