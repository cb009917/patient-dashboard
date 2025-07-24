import React from 'react';
import './Header.css';

const Header = ({ user, signOut }) => {
  return (
    <header className="dashboard-header">
      <div className="logo">
        <span role="img" aria-label="logo">🏥</span> MediSys Dashboard
      </div>
      <div className="user-section">
        <span className="username">Welcome, <strong>{user.username}</strong></span>
        <button className="signout-btn" onClick={signOut}>Sign out</button>
      </div>
    </header>
  );
};

export default Header;
