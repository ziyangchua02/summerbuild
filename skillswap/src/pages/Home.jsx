import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css'; 

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      {isAuthenticated ? (
        <>
          <h1 className="welcome-title-auth">Welcome back, {user?.name || user?.email}! 👋</h1>
          <p className="welcome-subtitle-auth">Ready to discover and exchange skills with the community?</p>
          {/* Add authenticated user content here */}
        </>
      ) : (
        <>
          <h1 className="welcome-title">Welcome to SkillSwap</h1>
          <p className="welcome-subtitle">This is the home page where users can discover and exchange skills.</p>
          {/* Add guest user content here */}
        </>
      )}
    </div>
  );
};

export default Home;