import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of Router and Routes

function App() {
  const [role, setRole] = useState(null); // State for the selected role
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole); // Set the selected role

    console.log('Selected role:', selectedRole); // Debugging log to check role selection

    // Send the selected role to the backend using an API request
    fetch('http://127.0.0.1:8000/api/save_role/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: selectedRole }), // Send only the role
    })
    .then(response => response.json())
    .then(data => {
      console.log('API response:', data); // Debugging log to check API response
      // Redirect to the signup page using navigate
      navigate('/login');
    })
    .catch((error) => {
      console.error('Error:', error); // Debugging log to check for errors
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Select Your Role</h1>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => handleRoleSelection('user')}
          style={styles.button}
        >
          User
        </button>
        <button
          onClick={() => handleRoleSelection('admin')}
          style={styles.button}
        >
          Admin
        </button>
      </div>
    </div>
  );
}

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
    fontSize: '2rem',
    color: '#white',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    backgroundColor: '#ff6f61',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '15px 30px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default App;
