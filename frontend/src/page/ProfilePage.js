import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [friendRequests, setFriendRequests] = useState('');
    const [friends, setFriends] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('userInfo') == null) {
            navigate('/login');
        } else {
            setUsername(JSON.parse(localStorage.getItem('userInfo')).username);
            fetchProfile();
        }
    }, [username]);

    const fetchProfile = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/profile/', { username });
            setProfileData(response.data);
            setFriendRequests(response.data.user.friend_request);
            setFriends(response.data.user.friends);
            setError('');
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    const acceptFriendRequest = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/accept-friend-request/', { username, friend_username: friendRequests });
            navigate('/profile');
        } catch (error) {
            console.error(error);
        }
    };

    const rejectFriendRequest = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/reject-friend-request/', { username, friend_username: friendRequests });
            navigate('/profile');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Profile Page</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {profileData && (
                <div>
                    <h2>User Info</h2>
                    <pre>{profileData.user.username}</pre>
                    <h2>User Posts</h2>
                    {profileData.post.map((post, index) => (
                        <div key={index}>
                            <pre>{post.text}</pre>
                            {post.image && (
                                <img
                                    src={`data:image/jpeg;base64,${post.image}`}
                                    alt="Post"
                                    style={{ width: '200px', height: 'auto' }} // Adjust the size as needed
                                    className="mt-2 rounded-lg w-full object-cover"
                                />
                            )}
                        </div>
                    ))}
                    <h2>Friend Requests:</h2>
                    {friends !== friendRequests &&
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px', backgroundColor: 'white', padding: '10px', border: '1px solid black', width: '50vw' }}>
                                <p className='' style={{ marginRight: '20px' }}>{friendRequests}</p>
                                <button onClick={acceptFriendRequest}>Accept</button>
                                <button onClick={rejectFriendRequest}>Reject</button>
                            </div>
                        </div>}
                    <h2>Friends</h2>
                    {friends &&
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px', backgroundColor: 'white', padding: '10px', border: '1px solid black', width: '50vw' }}>
                                <p className='' style={{ marginRight: '20px' }}>{friendRequests}</p>
                            </div>
                        </div>}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
