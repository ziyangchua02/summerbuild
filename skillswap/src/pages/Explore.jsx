import React from 'react';
import { FaBrain, FaBullseye, FaMapMarkerAlt, FaUserPlus } from 'react-icons/fa';
import '../styles/Explore.css';

const Explore = () => {

  const dummyUsers = [
    {
      id: 1,
      name: "Sarah Chen",
      location: "San Francisco, CA",
      profileImage: "https://via.placeholder.com/80",
      skillsOffered: [
        { name: "React", level: "Expert" },
        { name: "UI/UX Design", level: "Advanced" },
        { name: "Photography", level: "Intermediate" }
      ],
      skillsWanted: [
        { name: "Machine Learning", level: "Beginner" },
        { name: "Spanish", level: "Intermediate" }
      ]
    },
    {
      id: 2,
      name: "Marcus Johnson",
      location: "New York, NY",
      profileImage: "https://via.placeholder.com/80",
      skillsOffered: [
        { name: "Guitar", level: "Expert" },
        { name: "Music Production", level: "Advanced" },
        { name: "Audio Engineering", level: "Expert" }
      ],
      skillsWanted: [
        { name: "Video Editing", level: "Beginner" },
        { name: "Digital Marketing", level: "Intermediate" }
      ]
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      location: "Austin, TX",
      profileImage: "https://via.placeholder.com/80",
      skillsOffered: [
        { name: "Cooking", level: "Expert" },
        { name: "Baking", level: "Advanced" },
        { name: "Food Photography", level: "Intermediate" }
      ],
      skillsWanted: [
        { name: "Web Development", level: "Beginner" },
        { name: "Business Strategy", level: "Intermediate" }
      ]
    },
    {
      id: 4,
      name: "David Kim",
      location: "Seattle, WA",
      profileImage: "https://via.placeholder.com/80",
      skillsOffered: [
        { name: "Python", level: "Expert" },
        { name: "Data Analysis", level: "Expert" },
        { name: "Machine Learning", level: "Advanced" }
      ],
      skillsWanted: [
        { name: "Public Speaking", level: "Beginner" },
        { name: "Leadership", level: "Intermediate" }
      ]
    },
    {
      id: 5,
      name: "Lisa Thompson",
      location: "Denver, CO",
      profileImage: "https://via.placeholder.com/80",
      skillsOffered: [
        { name: "Yoga", level: "Expert" },
        { name: "Meditation", level: "Advanced" },
        { name: "Nutrition", level: "Intermediate" }
      ],
      skillsWanted: [
        { name: "Photography", level: "Beginner" },
        { name: "Social Media", level: "Intermediate" }
      ]
    },
    {
      id: 6,
      name: "Ahmed Hassan",
      location: "Chicago, IL",
      profileImage: "https://via.placeholder.com/80",
      skillsOffered: [
        { name: "Graphic Design", level: "Expert" },
        { name: "Illustration", level: "Advanced" },
        { name: "Branding", level: "Expert" }
      ],
      skillsWanted: [
        { name: "Animation", level: "Beginner" },
        { name: "Video Production", level: "Intermediate" }
      ]
    }
  ];

  const handleConnect = (userName) => {
    alert(`Connecting with ${userName}!`);
  };

  return (
    <div className="explore">
      <div className="explore-header">
        <h1>Explore Skills</h1>
        <p>Discover talented people in your community and connect for skill exchanges</p>
      </div>

      <div className="users-grid">
        {dummyUsers.map(user => (
          <div key={user.id} className="user-card">
            {/* User Header */}
            <div className="user-header">
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="user-image"
              />
              <div className="user-info">
                <h3>{user.name}</h3>
                <p className="user-location">
                  <FaMapMarkerAlt className="location-icon" />
                  {user.location}
                </p>
              </div>
            </div>

            {/* Skills Offered */}
            <div className="user-section">
              <h4 className="section-title">
                <FaBrain className="section-icon" /> Skills I Can Teach
              </h4>
              <div className="skill-list">
                {user.skillsOffered.map((skill, index) => (
                  <div key={index} className="skill-tag skill-offered">
                    {skill.name} <span className="skill-level">{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Wanted */}
            <div className="user-section">
              <h4 className="section-title">
                <FaBullseye className="section-icon" /> Skills I Want to Learn
              </h4>
              <div className="skill-list">
                {user.skillsWanted.map((skill, index) => (
                  <div key={index} className="skill-tag skill-wanted">
                    {skill.name} <span className="skill-level">{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect Button */}
            <button 
              className="connect-button"
              onClick={() => handleConnect(user.name)}
            >
              <FaUserPlus className="connect-icon" />
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;