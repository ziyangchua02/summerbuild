import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const { profileData, updateProfile, loading, error } = useProfile();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profileImageUrl: '',
    fullName: '',
    email: '',
    location: '',
    aboutMe: '',
    skillsOffered: [],
    skillsWanted: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        profileImageUrl: profileData.profileImageUrl || '',
        fullName: profileData.fullName || '',
        email: profileData.email || '',
        location: profileData.location || 'Singapore',
        aboutMe: profileData.aboutMe || '',
        skillsOffered: profileData.skillsOffered?.length > 0 ? profileData.skillsOffered : [{ name: '', level: 'Beginner' }],
        skillsWanted: profileData.skillsWanted?.length > 0 ? profileData.skillsWanted : [{ name: '', level: 'Beginner' }]
      });
    }
  }, [profileData]);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (skillType, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [skillType]: prev[skillType].map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const addSkill = (skillType) => {
    setFormData(prev => ({
      ...prev,
      [skillType]: [...prev[skillType], { name: '', level: 'Beginner' }]
    }));
  };

  const removeSkill = (skillType, index) => {
    setFormData(prev => ({
      ...prev,
      [skillType]: prev[skillType].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Filter out empty skills before saving
      const filteredFormData = {
        ...formData,
        skillsOffered: formData.skillsOffered.filter(skill => skill.name.trim() !== ''),
        skillsWanted: formData.skillsWanted.filter(skill => skill.name.trim() !== '')
      };

      const result = await updateProfile(filteredFormData);
      
      if (result.success) {
        setSubmitSuccess(true);
        
        if (result.warning) {
          setSubmitError(result.warning);
          setTimeout(() => {
            setSubmitError('');
          }, 5000);
        }
        
        setTimeout(() => {
          navigate('/profile');
        }, 1500); 
      } else {
        setSubmitError(result.error || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !profileData.email) {
    return (
      <div className="edit-profile">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-profile">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px',
          color: '#dc3545'
        }}>
          <p>Error loading profile: {error}</p>
          <button onClick={() => window.location.reload()} style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile">
      <form onSubmit={handleSave}>
        <h1>Edit Profile</h1>

        {/* Success/Error Messages */}
        {submitSuccess && (
          <div style={{
            padding: '12px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            Profile updated successfully! Redirecting...
          </div>
        )}
        
        {submitError && (
          <div style={{
            padding: '12px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            {submitError}
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="form-group">
          <label className="form-label">Profile Picture</label>
          <div className="profile-image-section">
            <img 
              src={formData.profileImageUrl || "https://via.placeholder.com/100"} 
              alt="Profile" 
              className="profile-image"
            />
            <input
              type="text"
              name="profileImageUrl"
              className="form-input"
              placeholder="Enter image URL (optional)"
              value={formData.profileImageUrl}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="form-input"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-input"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter your location"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="aboutMe">About Me</label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            className="form-input"
            rows="4"
            value={formData.aboutMe}
            onChange={handleInputChange}
          />
        </div>

        {/* Skills Offered Section */}
        <div className="form-group">
          <label className="form-label">🧠 Skills I Can Teach</label>
          <div className="skills-container">
            {formData.skillsOffered.map((skill, index) => (
              <div key={index} className="skill-entry">
                <input
                  type="text"
                  className="form-input skill-name-input"
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange('skillsOffered', index, 'name', e.target.value)}
                />
                <select
                  className="form-input skill-level-select"
                  value={skill.level}
                  onChange={(e) => handleSkillChange('skillsOffered', index, 'level', e.target.value)}
                >
                  {skillLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="remove-skill-btn"
                  onClick={() => removeSkill('skillsOffered', index)}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-skill-btn"
              onClick={() => addSkill('skillsOffered')}
            >
              + Add Skill
            </button>
          </div>
        </div>

        {/* Skills Wanted Section */}
        <div className="form-group">
          <label className="form-label">🎯 Skills I Want to Learn</label>
          <div className="skills-container">
            {formData.skillsWanted.map((skill, index) => (
              <div key={index} className="skill-entry">
                <input
                  type="text"
                  className="form-input skill-name-input"
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange('skillsWanted', index, 'name', e.target.value)}
                />
                <select
                  className="form-input skill-level-select"
                  value={skill.level}
                  onChange={(e) => handleSkillChange('skillsWanted', index, 'level', e.target.value)}
                >
                  {skillLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="remove-skill-btn"
                  onClick={() => removeSkill('skillsWanted', index)}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-skill-btn"
              onClick={() => addSkill('skillsWanted')}
            >
              + Add Skill
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button 
          type="submit" 
          className={`save-button ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;