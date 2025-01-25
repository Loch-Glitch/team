import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword({ isDarkMode }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get the email from the passed state
  const email = location.state?.email;

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please enter both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reset-password/', {
        email: email,
        newPassword: newPassword
      });

      if (response.status === 200) {
        alert('Password reset successfully!');
        navigate('/login');
      } else {
        setErrorMessage(response.data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  const handleBack = () => navigate('/forgot-password');

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
    button: {
      backgroundColor: isDarkMode ? '#61dafb' : '#4CAF50',
      color: isDarkMode ? '#282c34' : '#ffffff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 0',
      fontSize: '1rem',
      width: '100%',
      maxWidth: '400px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    backButton: {
      backgroundColor: 'transparent',
      color: isDarkMode ? '#61dafb' : '#4CAF50',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      textDecoration: 'underline',
      marginTop: '10px',
    },
    emailText: {
      fontSize: '1rem',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: '20px',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
      color: isDarkMode ? '#ffffff' : '#000000',
      fontSize: '1rem',
    },
    checkbox: {
      marginRight: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Reset Password</h1>
      <p style={styles.emailText}>Resetting password for: {email}</p>
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={styles.input}
      />
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={styles.input}
      />
      <div style={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
          style={styles.checkbox}
        />
        <label>Show Password</label>
      </div>
      {errorMessage && <div style={{...styles.emailText, color: 'red'}}>{errorMessage}</div>}
      <button onClick={handleReset} style={styles.button}>
        Reset Password
      </button>
      <button onClick={handleBack} style={styles.backButton}>
        Back
      </button>
    </div>
  );
}

export default ResetPassword;
