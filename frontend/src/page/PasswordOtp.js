import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PasswordOtp() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!otp) {
      alert('Please enter the OTP.');
      return;
    }
    console.log('OTP entered:', otp);
    navigate('/reset-password');
  };

  const handleBack = () => navigate('/forgot-password');

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#282c34',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      color: '#ffffff',
    },
    header: {
      fontSize: '2rem',
      color: '#61dafb',
      marginBottom: '20px',
    },
    input: {
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #61dafb',
      borderRadius: '5px',
      fontSize: '1rem',
      width: '100%',
      maxWidth: '400px',
      backgroundColor: '#3a3f47',
      color: '#ffffff',
    },
    button: {
      backgroundColor: '#61dafb',
      color: '#282c34',
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
      color: '#61dafb',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      textDecoration: 'underline',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Verify OTP</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleConfirm} style={styles.button}>Confirm</button>
      <button onClick={handleBack} style={styles.backButton}>Back</button>
    </div>
  );
}

export default PasswordOtp;