import React from 'react';
import '../styles/Banner.css';

const Banner = () => {
  return (
    <div className="banner-container">
      <div className="banner-scroll">
        <div className="banner-content">
          <div className="stat-item">
            <span className="stat-icon">💼</span>
            <span className="stat-text">99% of People use SkillSwap</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-text">#1 rated App on AppStore (G2)</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❤️</span>
            <span className="stat-text">1.5B+ community members</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🌍</span>
            <span className="stat-text">Over 3B users worldwide</span>
          </div>
          {/* Duplicate content for seamless loop */}
          <div className="stat-item">
            <span className="stat-icon">💼</span>
            <span className="stat-text">99% of People use SkillSwap</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-text">#1 rated App on AppStore (G2)</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❤️</span>
            <span className="stat-text">1.5B+ community members</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🌍</span>
            <span className="stat-text">Over 3B users worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;