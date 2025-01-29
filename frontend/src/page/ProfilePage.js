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
    const [loading, setLoading] = useState(true);
     const [posts, setPosts] = useState([]);

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

    const handleDeletePost = async (id) => {
        try {
          setLoading(true);
          console.log(profileData);
          
          await axios.post('http://127.0.0.1:8000/api/delete-post/', { id });
          alert('Post deleted successfully!');
          fetchPosts();
        } catch (error) {
          console.error('Error deleting post:', error);
        } finally {
          setLoading(false);
        }
      };


    // Fetch profile data on component mount or when username changes
    useEffect(() => {
        if (localStorage.getItem('userInfo') == null) {
            navigate('/login');
        } else {
            setUsername(JSON.parse(localStorage.getItem('userInfo')).username);
            fetchProfile();
        }
    }, [username]);

    // Function to fetch profile data
    const fetchProfile = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/profile/', { username });
            setProfileData(response.data);
            setFriendRequests(response.data.user.friend_request);
            setFriends(response.data.user.friends);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching profile data.');
        }
    };

    // Function to accept friend request
    const acceptFriendRequest = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/accept-friend-request/', { username, friend_username: friendRequests });
            fetchProfile(); // Refresh profile data after accepting friend request
        } catch (error) {
            console.error(error);
        }
    };

    // Function to reject friend request
    const rejectFriendRequest = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/reject-friend-request/', { username, friend_username: friendRequests });
            fetchProfile(); // Refresh profile data after rejecting friend request
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
                            <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                        </div>
                    ))}
                    <h2>Friend Requests:</h2>
                    {friends != friendRequests && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px', backgroundColor: 'white', padding: '10px', border: '1px solid black', width: '50vw' }}>
                                <p className='' style={{ marginRight: '20px' }}>{friendRequests}</p>
                                <button onClick={acceptFriendRequest}>Accept</button>
                                <button onClick={rejectFriendRequest}>Reject</button>
                            </div>
                        </div>
                    )}
                    <h2>Friends</h2>
                    {friends && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px', backgroundColor: 'white', padding: '10px', border: '1px solid black', width: '50vw' }}>
                                <p className='' style={{ marginRight: '20px' }}>{friendRequests}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;