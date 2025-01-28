import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUpPage from './page/Signup';
import LoginPage from './page/Login';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import HomePage from './page/Homepage';
import CreatePost from './page/create_post';
import Search from './page/search';
import Settings from './page/settings';
import PrivacyDoc from './page/PrivacyDoc';
import ProfilePage from './page/ProfilePage';
import FriendRequestPage from './page/FriendRequestPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create_post" element={<CreatePost />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacydoc" element={<PrivacyDoc />} />
        <Route path="/create-post" element={<CreatePost />} />
        {/* <Route path="/search" element={<Search />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/friend-request" element={<FriendRequestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;