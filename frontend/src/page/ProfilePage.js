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
        console.log(JSON.parse(localStorage.getItem('userInfo')).username);
        if (localStorage.getItem('userInfo') == null) {
            navigate('/login');
        } else {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            setUsername(userInfo.username);
            fetchProfile(userInfo.username);
        }
    }, [navigate]);

    // Function to fetch profile data
    const fetchProfile = async (userName) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/profile/', { username: userName });
            setProfileData(response.data);
            setFriendRequests(response.data.user.friend_request);
            setFriends(response.data.user.friends);
            setError('');
        } catch (err) {
            console.log(err.response?.data?.error);

            setError(err.response?.data?.error || 'An error occurred while fetching profile data.');
        }
    };


    // Function to accept friend request
    const acceptFriendRequest = async (friendUsername) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/accept-friend-request/', { username, friend_username: friendUsername });
            fetchProfile(); // Refresh profile data after accepting friend request
            // await axios.post('http://127.0.0.1:8000/api/accept-friend-request/', { username, friend_username: friendRequests });
            // navigate('/profile');
        } catch (error) {
            console.error(error);
        }
    };

    // Function to reject friend request
    const rejectFriendRequest = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/reject-friend-request/', { username, friend_username: friendRequests });
            fetchProfile(); // Refresh profile data after rejecting friend request
            // await axios.post('http://127.0.0.1:8000/api/reject-friend-request/', { username, friend_username: friendRequests });
            // navigate('/profile');
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
                            {/* </div>
                    ))}
                    <h2>Friend Requests:</h2>
                    {friends != friendRequests && ( */}
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
                        friendRequests?.map((friend) =>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px', backgroundColor: 'white', padding: '10px', border: '1px solid black', width: '50vw' }}>
                                    <p className='' style={{ marginRight: '20px' }}>{friend}</p>
                                    <button onClick={() => acceptFriendRequest(friend)}>Accept</button>
                                    <button onClick={() => rejectFriendRequest(friend)}>Reject</button>
                                </div>
                            </div>)
                    }
                    {/* <h2>Friends</h2>
                    {friends && (
                        </div>} */}
                    <h2>Friends</h2>
                    {friends &&
                        friends.map((friend) =>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px', backgroundColor: 'white', padding: '10px', border: '1px solid black', width: '50vw' }}>
                                    <p className='' style={{ marginRight: '20px' }}>{friend}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
