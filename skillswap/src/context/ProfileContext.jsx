import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(() => {
    // Load profile data from localStorage if it exists
    const savedProfile = localStorage.getItem('skillswap-profile');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    
    // Default profile data
    return {
      profileImageUrl: '',
      fullName: 'Ziyang',
      email: 'ziyang@example.com',
      aboutMe: 'I love teaching hands-on skills and am excited to learn from others too.',
      skillsOffered: [
        { name: 'Guitar', level: 'Advanced' },
        { name: 'Python', level: 'Expert' },
        { name: 'Cooking', level: 'Intermediate' }
      ],
      skillsWanted: [
        { name: 'Photography', level: 'Beginner' },
        { name: 'Web Design', level: 'Intermediate' },
        { name: 'Public Speaking', level: 'Beginner' }
      ]
    };
  });

  // Save to localStorage whenever profileData changes
  useEffect(() => {
    localStorage.setItem('skillswap-profile', JSON.stringify(profileData));
  }, [profileData]);

  const updateProfile = (newProfileData) => {
    setProfileData(newProfileData);
  };

  const value = {
    profileData,
    updateProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
