import React, { useState } from 'react';
import axios from 'axios';

const FriendRequestPage = () => {
    const [username, setUsername] = useState('');
    const [friend_username, setFriendUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const sendFriendRequest = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/friend-request/', { username, friend_username });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response.data.error);
        }
    };




    return (
        <div>
            <h1>Friend Request Page</h1>
            <input 
                type="text" 
                placeholder="Your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Friend's username" 
                value={friend_username} 
                onChange={(e) => setFriendUsername(e.target.value)} 
            />
            <button onClick={sendFriendRequest}>Send Friend Request</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default FriendRequestPage;

