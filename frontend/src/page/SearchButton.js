import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchButton = () => {
    const [username, setUsername] = useState('');
    const [friendUsername, setFriendUsername] = useState('')
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const user_name = JSON.parse(localStorage.getItem('userInfo')).username
        setUsername(user_name)
    })

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/search-user/', { username: friendUsername });
            setUserData(response.data.user);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
            setUserData(null);
        }
    };

    const sendFriendRequest = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/friend-request/', { username, friend_username: userData.username });
            // setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
  {/* Search Input */}
  <div className="flex items-center space-x-2">
    <input
      type="text"
      value={friendUsername}
      onChange={(e) => setFriendUsername(e.target.value)}
      placeholder="Enter username"
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button 
      onClick={handleSearch} 
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
      Search
    </button>
  </div>

  {/* Error Message */}
  {error && <p className="mt-2 text-red-500">{error}</p>}

  {/* User Data */}
  {userData && (
    <div className="mt-4 bg-gray-100 p-4 rounded-md shadow">
      <h3 className="text-lg font-semibold">User Details:</h3>
      <div className="flex justify-between items-center mt-2 p-3 bg-white rounded-md shadow-sm">
        <p className="text-gray-800 font-medium">{userData.name}</p>
        <button 
          onClick={sendFriendRequest} 
          className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Send Request
        </button>
      </div>
    </div>
  )}
</div>

    );
};

export default SearchButton;
