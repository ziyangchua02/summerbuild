import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const { profileData, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(profileData);

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

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    console.log('Profile updated:', formData);
    alert('Profile updated successfully!');
    navigate('/profile');
  };

  return (
    <div className="edit-profile">
      <form onSubmit={handleSave}>
        <h1>Edit Profile</h1>
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
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;