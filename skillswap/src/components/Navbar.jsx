import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo/Brand */}
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <span className="logo-text">SkillSwap</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="navbar-right">
            <div className="nav-links">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>
              
              <Link 
                to="/explore" 
                className={`nav-link ${isActive('/explore') ? 'active' : ''}`}
              >
                Explore
              </Link>

              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                  >
                    Profile
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="nav-link logout-button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
