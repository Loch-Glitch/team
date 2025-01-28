import React, { useState } from 'react';
import axios from 'axios';

const SearchButton = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/search-user/', { username });
            setUserData(response.data.user);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
            setUserData(null);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
            />
            <button onClick={handleSearch}>Search</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userData && (
                <div>
                    <h3>User Details:</h3>
                    <pre>{JSON.stringify(userData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default SearchButton;
