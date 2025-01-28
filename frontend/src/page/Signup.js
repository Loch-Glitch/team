import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function SignUpPage({ isDarkMode }) {
  // Existing state variables
  const [name, setname] = useState('');
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isEmailVerification, setIsEmailVerification] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailTimer, setEmailTimer] = useState(300); // 5 minutes in seconds
  const [emailOtpExpired, setEmailOtpExpired] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [emailOtpAttempts, setEmailOtpAttempts] = useState(0); // Track email OTP attempts
 

  const navigate = useNavigate();

  // Timer effect for email OTP
  useEffect(() => {
    let interval;
    if (isEmailVerification && emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer((prev) => {
          if (prev <= 1) {
            setEmailOtpExpired(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEmailVerification, emailTimer]);

  
  // Format timer display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{3,}$/;
    return passwordRegex.test(password);
  };



  // Modified email verification handler
  const handleEmailVerification = async () => {
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      setError('');
      setIsEmailVerification(true);
      setEmailTimer(300);
      setEmailOtpExpired(false);
      setEmailOtpAttempts(0); // Reset attempts on new OTP request
      await axios.post('http://127.0.0.1:8000/api/request-email-otp/', { email });
    } catch (error) {
      setError('Failed to request email verification. Please try again.');
    }
  };

  // Handle OTP submission with retry logic
  const handleEmailOtpSubmission = async () => {
    if (emailOtpExpired) {
      setError('OTP has expired. Please request a new one.');
      return;
    }
    if (emailOtpAttempts >= 3) {
      setError('Too many incorrect attempts. Please request a new OTP.');
      return;
    }
    try {
      setError('');
      await axios.post('http://127.0.0.1:8000/api/verify-email-otp/', { email, otp: emailOtp });
      alert('Email verified successfully!');
      setIsEmailVerification(false);
    } catch (error) {
      setError('Invalid OTP. Please try again.');
      setEmailOtpAttempts((prev) => prev + 1); // Increment OTP attempts
    }
  };

  

  const handleSignUp = async () => {
    if (!name || !username || !email || !password || !confirmPassword || !privacyChecked) {
      setError('Please fill all the required fields and agree to the privacy terms.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 3 characters long, contain letters, numbers, and at least one symbol.');
      return;
    }
    setError('');

    const userData = {
      name,
      username,
      email,
      password,
      confirmPassword
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/signup/', userData);
      if (response.status === 200 || response.status === 201) {
        alert('Sign-up successful! Welcome to our platform!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError(error.response.data.error)
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

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
    errorText: {
      color: 'red',
      fontSize: '0.875rem',
      marginTop: '-8px',
      marginBottom: '10px',
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
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
      width: '100%',
      maxWidth: '400px',
    },
    link: {
      color: isDarkMode ? '#61dafb' : '#4CAF50',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    toggleButton: {
      backgroundColor: isDarkMode ? '#61dafb' : '#4CAF50',
      color: isDarkMode ? '#282c34' : '#ffffff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Sign Up</h1>
      
      {error && <p style={styles.errorText}>{error}</p>}
      
      <div style={styles.formContainer}>
        <input
          type="text"
          placeholder=" Name (Required)"
          value={name}
          onChange={(e) => setname(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder=" Username (Required)"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email Address (Required)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleEmailVerification}
          style={styles.signupButton}
          disabled={isEmailVerification}
        >
          {isEmailVerification ? `Resend Email OTP in ${formatTime(emailTimer)}` : 'Verify Email'}
        </button>
        {isEmailVerification && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
            style={styles.input}
          />
        )}
        {isEmailVerification && (
          <button onClick={handleEmailOtpSubmission} style={styles.signupButton}>
            Submit OTP
          </button>
        )}

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password (Required)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password (Required)"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />

        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />
          Show Password
        </label>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={privacyChecked}
            onChange={() => setPrivacyChecked((prev) => !prev)}
          />
          <label>
            I agree to the <Link to="/privacydoc" style={styles.link}>privacy policy</Link>
          </label>
        </div>

        <button onClick={handleSignUp} style={styles.signupButton}>
          Sign Up
        </button>
      </div>
      <div>
        <p>Already have an account? <Link to="/login" style={styles.link}>Login</Link></p>
      </div>
    </div>
  );
}

export default SignUpPage;