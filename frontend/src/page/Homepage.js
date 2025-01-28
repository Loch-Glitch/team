import React, { useState, useEffect } from 'react';
import { FaRegUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

function HomePage({ isDarkMode }) {

  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate()
  const [text, settext] = useState("")
  const [ errorMessage , setErrorMessage] = useState("")

  // useEffect(() => {
  //   let timeoutId;

  //   const resetTimer = () => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => {
  //       Cookies.remove('csrftoken'); // Clear user session
  //       navigate('/login'); // Redirect to login after inactivity
  //     }, 10000); // 1 minute
  //   };

  //   // Event listeners for user activity
  //   window.addEventListener('mousemove', resetTimer);
  //   window.addEventListener('keydown', resetTimer);
  //   window.addEventListener('click', resetTimer);
  //   window.addEventListener('scroll', resetTimer);

  //   // Start the timer
  //   resetTimer();

  //   // Cleanup event listeners and timeout on component unmount
  //   return () => {
  //     clearTimeout(timeoutId);
  //     window.removeEventListener('mousemove', resetTimer);
  //     window.removeEventListener('keydown', resetTimer);
  //     window.removeEventListener('click', resetTimer);
  //     window.removeEventListener('scroll', resetTimer);
  //   };
  // }, [navigate]);

  const handleLogout = async () => {
    try {
      Cookies.remove('csrftoken'); // Only remove on logout
      navigate('/login')
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
      position: 'relative'
    },
    header: {
      fontSize: '2rem',
      color: isDarkMode ? '#61dafb' : '#333',
    },
    message: {
      fontSize: '1.2rem',
      color: isDarkMode ? '#ffffff' : '#555',
    },
    profile: {
      position: 'absolute',
      right: '10px',
      top: '10px',
    },
    profile_icon: {
      cursor: 'pointer',
      width: '30px',
      height: '30px',
    },
    dropdown: {
      position: 'absolute',
      top: '40px',
      right: '0',
      backgroundColor: isDarkMode ? '#333' : '#fff',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      padding: '10px 0',
      zIndex: 100,
    },
    ul: {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
    },
    li: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 20px',
      fontSize: '1rem',
      color: isDarkMode ? '#ffffff' : '#333',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    liHover: {
      backgroundColor: isDarkMode ? '#444' : '#f0f0f0',
    },
    icon: {
      marginRight: '10px',
    }
  };

const userpost = {
  text
};

  const handlecreatepost = async()=> {
    try {
    const response = await axios.post("http://127.0.0.1:8000/api/create-post/" , userpost)
    }
    catch (error) {
      setErrorMessage("an error occured")
   }
  };

  return (
    <div style={styles.container}>
      <div className='profile' style={styles.profile}>
        <FaRegUserCircle style={styles.profile_icon} onClick={() => setDropdown(!dropdown)} />
        {dropdown && (
          <div className='dropdown' style={styles.dropdown}>
            <ul style={styles.ul}>
              <li
                style={{ ...styles.li }}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.liHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => { navigate('/profile') }}
              >
                <FaUser style={styles.icon} /> Profile
              </li>
              <li
                style={{ ...styles.li }}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.liHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={handleLogout}
              >
                <FaSignOutAlt style={styles.icon} /> Logout
              </li>
            </ul>

          
          
          </div>
        )}
      </div>
      <h1 style={styles.header}>Welcome to the Home Page</h1>
      <p style={styles.message}>You have successfully logged in!</p>
      {/* <input
            style={styles.postform_icon} onClick={() => setDropdown(!dropdown)} />
            type="text"
            placeholder="text"
            value={text}
            onChange={(e) => settext(e.target.value)}  */}
      <button onClick={() => navigate('/create_post')} > Create post </button>
    </div>
  );
}

export default HomePage;
