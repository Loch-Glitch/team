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
            setUsername(JSON.parse(localStorage.getItem('userInfo')).username);
            fetchProfile(JSON.parse(localStorage.getItem('userInfo')).username);
        }
    }, []);

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
    const rejectFriendRequest = async (friendUsername) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/reject-friend-request/', { username, friend_username: friendUsername });
            fetchProfile(); // Refresh profile data after rejecting friend request
            // await axios.post('http://127.0.0.1:8000/api/reject-friend-request/', { username, friend_username: friendRequests });
            // navigate('/profile');
        } catch (error) {
            console.error(error);
        }
    };

    return (
                <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile Page</h1>
        
                    {error && <p className="text-red-500 text-center">{error}</p>}
        
                    {profileData && (
                        <div className="space-y-6">
                            {/* User Info Card */}
                            <div className="bg-white shadow-lg rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">User Info</h2>
                                <div className="space-y-2">
                                    <p><span className="font-bold">Nick Name:</span> {profileData.user.name}</p>
                                    <p><span className="font-bold">Username:</span> {profileData.user.username}</p>
                                    <p><span className="font-bold">Email:</span> {profileData.user.email}</p>
                                </div>
                            </div>
        
                            {/* User Posts */}
                            <div className="bg-white shadow-lg rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">User Posts</h2>
                                <div className="space-y-4">
                                    {profileData.post.map((post, index) => (
                                        <div key={index} className="p-4 border rounded-lg shadow-md bg-gray-50">
                                            <pre className="text-gray-700">{post.text}</pre>
                                            {post.image && (
                                                <img
                                                    src={`data:image/jpeg;base64,${post.image}`}
                                                    alt="Post"
                                                    className="mt-2 rounded-lg max-w-[50vw] max-h-[50vh] object-cover"
                                                />
                                            )}
                                            <button
                                                onClick={() => handleDeletePost(post._id)}
                                                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
        
                            {/* Friend Requests */}
                            {friendRequests && friendRequests.length > 0 && (
                                <div className="bg-white shadow-lg rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Friend Requests</h2>
                                    <div className="space-y-4">
                                        {friendRequests.map((friend, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 shadow">
                                                <p className="text-gray-700">{friend}</p>
                                                <div className="space-x-2">
                                                    <button
                                                        onClick={() => acceptFriendRequest(friend)}
                                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => rejectFriendRequest(friend)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
        
                            {/* Friends List */}
                            {friends && friends.length > 0 && (
                                <div className="bg-white shadow-lg rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-green-500">Friends</h2>
                                    <div className="space-y-2">
                                        {friends.map((friend, index) => (
                                            <div key={index} className="p-4 border rounded-lg bg-gray-50 shadow text-center">
                                                <p className="text-gray-700">{friend}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            
    );
};

export default ProfilePage;
