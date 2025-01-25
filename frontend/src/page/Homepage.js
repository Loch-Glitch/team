import React from 'react';

function HomePage({ isDarkMode }) {
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
      fontSize: '2rem',
      color: isDarkMode ? '#61dafb' : '#333',
    },
    message: {
      fontSize: '1.2rem',
      color: isDarkMode ? '#ffffff' : '#555',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to the Home Page</h1>
      <p style={styles.message}>You have successfully logged in!</p>
    </div>
  );
}

export default HomePage;