import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import HowItWorks from '../components/HowItWorks';
import Banner from '../components/Banner';
import '../styles/Home.css'; 

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { profileData } = useProfile();
  
  const skills = [
    'code', 'design', 'cook', 'paint', 'sing', 'dance', 'write', 'photograph',
    'speak languages', 'play guitar', 'draw', 'garden', 'craft', 'teach',
    'build apps', 'market', 'analyze data', 'lead teams'
  ];
  
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeSpeed, setTypeSpeed] = useState(100);

  useEffect(() => {
    const currentSkill = skills[currentSkillIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentSkill.length) {
          setDisplayText(currentSkill.substring(0, displayText.length + 1));
          setTypeSpeed(100);
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentSkill.substring(0, displayText.length - 1));
          setTypeSpeed(50);
        } else {
          setIsDeleting(false);
          setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % skills.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentSkillIndex, skills, typeSpeed]);

  return (
    <div className="home-container">
      {isAuthenticated ? (
        <>
          <h1 className="welcome-title-auth">
            Welcome back, <span className="username-highlight">{profileData?.fullName || user?.name || user?.email}</span>!
          </h1>
          <p className="welcome-subtitle-auth">Ready to discover and exchange skills with the community?</p>
          <HowItWorks />
          <Banner />
        </>
      ) : (
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="welcome-title">
              Welcome to<br />
              <span className="brand-highlight">SkillSwap</span>!
            </h1>
            <div className="typing-container">
              <h2 className="typing-text">
                Learn to <span className="typed-skill">{displayText}</span>
                <span className="typing-cursor">|</span>
              </h2>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://img.freepik.com/free-vector/hand-drawn-stickman-collection_23-2149200339.jpg?ga=GA1.1.1616025317.1750692733&semt=ais_hybrid&w=740" alt="SkillSwap Logo" className="hero-logo" />
          </div>
        </div>
      )}
      {!isAuthenticated && <HowItWorks />}
      {!isAuthenticated && <Banner />}
    </div>
  );
};

export default Home;