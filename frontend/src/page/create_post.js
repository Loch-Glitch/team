import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ text: '', username: '', image: '' });
  const [loading, setLoading] = useState(false);

  // Fetch posts from the API
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

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create a new post
  const createPost = async () => {
    if (!newPost.text || !newPost.username) {
      alert('Text and Username are required!');
      return;
    }
    try {
      setLoading(true);
      await axios.post('http://127.0.0.1:8000/api/create-post/', newPost);
      alert('Post created successfully!');
      setNewPost({ text: '', username: '', image: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a post by ID
  const deletePost = async (id) => {
    try {
      setLoading(true);
      await axios.post('/api/delete-post/', { id });
      alert('Post deleted successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Post Management</h1>

      {/* Create Post Section */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Create a New Post</h2>
        <input
          type="text"
          placeholder="Text"
          value={newPost.text}
          onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Username"
          value={newPost.username}
          onChange={(e) => setNewPost({ ...newPost, username: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Image URL (Optional)"
          value={newPost.image}
          onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={createPost}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </div>

      {/* Posts List Section */}
      <div className="w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          posts.length > 0 ? (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post._id} className="bg-white p-4 rounded-lg shadow-md">
                  <p className="text-gray-700 font-medium">{post.text}</p>
                  <p className="text-sm text-gray-500">By: {post.username}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="mt-2 rounded-lg w-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => deletePost(post._id)}
                    className="mt-2 text-red-500 hover:underline"
                  >
                    Delete Post
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts available.</p>
          )
        )}
      </div>
    </div>
  );
};

export default App;
