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
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Profile Section */}
      <div className="relative flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        <div className="relative">
          <FaRegUserCircle
            className="text-3xl cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={() => setDropdown(!dropdown)}
          />
          {dropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
              <ul className="py-2">
                <li
                  className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => navigate('/profile')}
                >
                  <FaUser className="text-gray-600" /> Profile
                </li>
                <li
                  className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-gray-600" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">SNS Media</h1>
      </div>

      {/* Success Message */}
      <p className="mt-4 text-green-600 font-semibold text-center">You have successfully logged in!</p>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={() => navigate('/create_post')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Create Post
        </button>
        <button onClick={() => navigate('/search')} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
          Search User
        </button>
      </div>

      {/* Posts Section */}
      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md border">
            <p className="text-gray-700">{post.text}</p>
            {post.image && (
              <img
                src={`data:image/jpeg;base64,${post.image}`}
                alt="Post"
                className="mt-2 rounded-lg w-full max-h-60 object-contain"
              />
            )}
            <p className="text-sm text-gray-500 mt-2">Posted by: <span className="font-medium">{post.username}</span></p>
            <p className="text-sm text-gray-400">Date: {new Date(post.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}

      {/* Error Message */}
      {errorMessage && <p className="text-center text-red-500 mt-4">{errorMessage}</p>}
    </div>

  );
}

export default HomePage;