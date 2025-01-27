import React from 'react';

const ProfilePage = () => {
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '30px',
    },
    profileImage: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      marginRight: '20px',
    },
    profileInfo: {
      flex: 1,
    },
    name: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    bio: {
      fontSize: '14px',
      color: '#666',
      marginTop: '10px',
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    stat: {
      textAlign: 'center',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    statLabel: {
      fontSize: '14px',
      color: '#666',
    },
    postsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginTop: '30px',
    },
    post: {
      width: '100%',
      height: '200px',
      backgroundColor: '#eee',
      borderRadius: '8px',
    },
  };

  const profileData = {
    name: 'Prakash',
    username: 'johndoe',
    bio: 'Web developer with a passion for building user-friendly applications.',
    profileImage: 'https://via.placeholder.com/150', // Replace with actual image URL
    posts: [1], // Simulated post data
    stats: {
      posts: 1,
      followers: 0,
      following: 0,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img
          src={profileData.profileImage}
          alt="Profile"
          style={styles.profileImage}
        />
        <div style={styles.profileInfo}>
          <h2 style={styles.name}>{profileData.name}</h2>
          <p style={styles.bio}>{profileData.bio}</p>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statValue}>{profileData.stats.posts}</div>
              <div style={styles.statLabel}>Posts</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statValue}>{profileData.stats.followers}</div>
              <div style={styles.statLabel}>Followers</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statValue}>{profileData.stats.following}</div>
              <div style={styles.statLabel}>Following</div>
            </div>
          </div>
        </div>
      </div>
      <div style={styles.postsContainer}>
        {profileData.posts.map((_, index) => (
          <div key={index} style={styles.post}></div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
