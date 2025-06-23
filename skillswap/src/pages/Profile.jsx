import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaBullseye, FaUser } from 'react-icons/fa';
import { useProfile } from '../context/ProfileContext';
import '../styles/Profile.css';

const Profile = () => {
  const { profileData } = useProfile();

  return (
    <div className="profile">
      {/* Profile Header */}
      <section className="profile-header">
        <img 
          src={profileData.profileImageUrl || "https://via.placeholder.com/100"} 
          alt="Profile" 
          className="profile-image"
        />
        <div className="profile-info">
          <h1>{profileData.fullName}</h1>
          <p>{profileData.email}</p>
          <Link to="/edit-profile" className="edit-button">
            Edit Profile
          </Link>
        </div>
      </section>

      {/* Skills Offered */}
      <section>
        <h2 className="section-title"><FaBrain className="section-icon" /> Skills I Can Teach</h2>
        <ul className="skill-list">
          {profileData.skillsOffered.map((skill, index) => (
            <li key={index}>
              {skill.name} <span className="skill-level">{skill.level}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills Wanted */}
      <section>
        <h2 className="section-title"><FaBullseye className="section-icon" /> Skills I Want to Learn</h2>
        <ul className="skill-list">
          {profileData.skillsWanted.map((skill, index) => (
            <li key={index}>
              {skill.name} <span className="skill-level">{skill.level}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* About Me */}
      <section>
        <h2 className="section-title"><FaUser className="section-icon" /> About Me</h2>
        <p className="about-me">
          {profileData.aboutMe}
        </p>
      </section>
    </div>
  );
};

export default Profile;