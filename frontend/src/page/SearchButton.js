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
        <div>
            <input
                type="text"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                placeholder="Enter username"
            />
            <button onClick={handleSearch}>Search</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userData && (
                <div>
                    <h3>User Details:</h3>
                    <div style={{display: 'flex', margin: '20px', backgroundColor: 'white', padding: '10px' }}>
                        <p className='' style={{marginRight: '20px'}}>{userData.name}</p>
                        <button onClick={sendFriendRequest}>Send Request</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchButton;
