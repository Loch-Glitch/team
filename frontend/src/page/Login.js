import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid email or password.');
        return;
      }

      setError('');
      console.log(data.message);
      navigate('/home');
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
      console.error('Login error:', err);
    }
  };

  const handleSignupRedirect = () => navigate('/signup');
  const handleForgotPasswordRedirect = () => navigate('/forgot-password');

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
    inputFocus: {
      borderColor: '#ff6f61',
    },
    loginButton: {
      backgroundColor: '#ff6f61',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '15px 0',
      fontSize: '1rem',
      width: '100%',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    loginButtonHover: {
      backgroundColor: '#ff4b47',
    },
    loginButtonActive: {
      transform: 'scale(0.95)',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '400px',
      marginTop: '20px',
    },
    footerButton: {
      backgroundColor: 'transparent',
      color: '#ff6f61',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      textDecoration: 'underline',
    },
    error: {
      color: 'red',
      fontSize: '1rem',
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Login</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.formContainer}>
      <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>
      <button
        onClick={handleLogin}
        style={styles.loginButton}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = styles.loginButtonHover.backgroundColor)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = '#ff6f61')
        }
        onMouseDown={(e) =>
          (e.currentTarget.style.transform = styles.loginButtonActive.transform)
        }
        onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
      >
        Login
      </button>
      <div style={styles.footer}>
        <button onClick={handleSignupRedirect} style={styles.footerButton}>
          Sign Up
        </button>
        <button onClick={handleForgotPasswordRedirect} style={styles.footerButton}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
