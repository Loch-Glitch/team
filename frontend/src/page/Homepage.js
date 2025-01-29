import React, { useState, useEffect } from 'react';
import { FaRegUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SearchButton from './SearchButton'; // Importing the SearchButton component

function HomePage({ isDarkMode }) {
  const [dropdown, setDropdown] = useState(false);
  const [posts, setPosts] = useState([]); // State to store posts
  const [page, setPage] = useState(1); // State for pagination
  const [hasMore, setHasMore] = useState(true); // State to check if more posts are available
  const [loading, setLoading] = useState(false); // State to handle loading
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [newPost, setNewPost] = useState({ text: '', username: '', image: '' });

  
  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/get-posts/');
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNewPost({ ...newPost, username: JSON.parse(localStorage.getItem('userInfo')).username });
    fetchPosts();
  }, []);


 
  // Handle logout
  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!localStorage.getItem('userInfo')) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle infinite scroll
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    }
  };

  // Add scroll event listener for infinite scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#282c34' : '#f0f0f0',
      color: isDarkMode ? '#ffffff' : '#000000',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      position: 'relative',
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
    },
    postContainer: {
      width: '80%',
      maxWidth: '600px',
      margin: '20px 0',
      padding: '20px',
      backgroundColor: isDarkMode ? '#333' : '#fff',
      borderRadius: '10px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    postContent: {
      fontSize: '1rem',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    postAuthor: {
      fontSize: '0.9rem',
      color: isDarkMode ? '#61dafb' : '#555',
      marginTop: '10px',
    },
    postDate: {
      fontSize: '0.8rem',
      color: isDarkMode ? '#888' : '#777',
      marginTop: '5px',
    },
    loading: {
      fontSize: '1rem',
      color: isDarkMode ? '#ffffff' : '#000000',
      margin: '20px 0',
    },
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
                onClick={() => navigate('/profile')}
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
      <h1 style={styles.header}>SNS Media</h1>
      <p style={styles.message}>You have successfully logged in!</p>
      <SearchButton /> {/* Adding the SearchButton component */}
      <button onClick={() => navigate('/create_post')}>Create post</button>

      {/* Display posts */}
      <div>
        {posts.map((post) => (
          <div key={post.id} style={styles.postContainer}>
            <p style={styles.postContent}>{post.text}</p>
            {post.image && (
                    <img
                      src={`data:image/jpeg;base64,${post.image}`}
                      alt="Post"
                      className="mt-2 rounded-lg w-full max-h-60 object-contain"
                      style={{width: '100%'}}
                    />
                  )}
            <p style={styles.postAuthor}>Posted by: {post.username}</p>
            <p style={styles.postDate}>Date: {new Date(post.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Show loading indicator */}
      {loading && <p style={styles.loading}>Loading...</p>}

      {/* Show error message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default HomePage;