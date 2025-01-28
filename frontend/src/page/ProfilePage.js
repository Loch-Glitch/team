import React, { useState,useEffect} from 'react';
import axios from 'axios';


const ProfilePage = () => {
    const [username, setUsername] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');

    console.log(profileData);
    useEffect(() => {
        setUsername(JSON.parse(localStorage.getItem('userInfo')).username);
        fetchProfile();
    }, [username]);

    console.log(username);
    

    const fetchProfile = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/profile/', { username });
            setProfileData(response.data);
            setError('');
        } catch (err) {
            setError(err.response.data.error);
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;