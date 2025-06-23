import React, { useRef, useEffect, useState } from 'react';
import { FaBrain, FaHandshake, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`how-it-works ${isVisible ? 'animate' : ''}`}
    >
      <h2 className="how-it-works-title">How It Works</h2>
      <div className="steps-container">
        <div className="step-box">
          <div className="step-number">1</div>
          <div className="step-icon">
            <FaBrain />
          </div>
          <h3 className="step-title">Add Your Skills</h3>
          <p className="step-description">Tell us what you can teach & learn</p>
        </div>
        <div className="step-box">
          <div className="step-number">2</div>
          <div className="step-icon">
            <FaHandshake />
          </div>
          <h3 className="step-title">Match with Users</h3>
          <p className="step-description">Get matched with others nearby</p>
        </div>
        <div className="step-box">
          <div className="step-number">3</div>
          <div className="step-icon">
            <FaMapMarkerAlt />
          </div>
          <h3 className="step-title">Meet & Learn</h3>
          <p className="step-description">Connect in real life to exchange</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;