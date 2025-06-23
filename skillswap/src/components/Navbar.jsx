import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser, AiOutlineEdit, AiOutlineLogout, AiOutlineLogin } from 'react-icons/ai'
import { useAuth } from '../context/AuthContext'
import '../styles/Navbar.css'

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    console.log('Navbar is rendering');

    const linkClass = ({isActive}) => 
                        isActive
                        ? "nav-link active"
                        : "nav-link";

    const handleLogout = () => {
        logout();
        navigate('/');
    };

  return (
    <>
        <nav className="navbar">
        <div className="navbar-container">
            <div className="navbar-content">
            <div className="navbar-left">
                {/* Logo */}
                <NavLink className="navbar-logo" to='/'>
                <span className="logo-text">SkillSwap</span>
                </NavLink>
                <div className="navbar-right">
                <div className="nav-links">
                    <NavLink
                    to="/"
                    className={linkClass}
                    end
                    ><AiOutlineHome /> Home
                    </NavLink>
                    <NavLink
                    to="/explore"
                    className={linkClass}
                    ><AiOutlineSearch /> Explore Skills
                    </NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink
                            to="/profile"
                            className={linkClass}
                            ><AiOutlineUser /> My Profile
                            </NavLink>
                            <NavLink
                            to="/edit-profile"
                            className={linkClass}
                            ><AiOutlineEdit /> Edit Profile
                            </NavLink>
                        </>
                    )}
                    {isAuthenticated ? (
                        <button
                        onClick={handleLogout}
                        className="nav-link logout-button"
                        ><AiOutlineLogout /> Logout
                        </button>
                    ) : (
                        <NavLink
                        to="/login"
                        className={linkClass}
                        ><AiOutlineLogin /> Login
                        </NavLink>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
        </nav>
    </>
  )
}

export default Navbar;