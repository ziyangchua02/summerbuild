import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState({
    profileImageUrl: '',
    fullName: '',
    email: '',
    location: '',
    aboutMe: '',
    skillsOffered: [],
    skillsWanted: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load profile data from Supabase when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadProfile();
    } else {
      // Reset profile data when user logs out
      setProfileData({
        profileImageUrl: '',
        fullName: '',
        email: '',
        location: '',
        aboutMe: '',
        skillsOffered: [],
        skillsWanted: []
      });
    }
  }, [isAuthenticated, user?.id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        // Handle the case where the table doesn't exist
        if (error.code === '42P01') { // Table doesn't exist
          console.warn('Profiles table does not exist. Using default profile data.');
          // Set default profile data with user info
          setProfileData({
            profileImageUrl: '',
            fullName: user.name || '',
            email: user.email || '',
            location: 'Singapore',
            aboutMe: '',
            skillsOffered: [],
            skillsWanted: []
          });
          return;
        }
        throw error;
      }

      if (data) {
        setProfileData({
          profileImageUrl: data.profile_image_url || '',
          fullName: data.full_name || '',
          email: data.email || user.email || '',
          location: data.location || 'Singapore',
          aboutMe: data.about_me || '',
          skillsOffered: data.skills_offered || [],
          skillsWanted: data.skills_wanted || []
        });
      } else {
        // No profile exists, create initial profile with user data
        setProfileData({
          profileImageUrl: '',
          fullName: user.name || '',
          email: user.email || '',
          location: 'Singapore',
          aboutMe: '',
          skillsOffered: [],
          skillsWanted: []
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      
      // If it's a table not found error, use default data instead of showing error
      if (error.code === '42P01' || error.message?.includes('relation "profiles" does not exist')) {
        console.warn('Profiles table does not exist. Using default profile data.');
        setProfileData({
          profileImageUrl: '',
          fullName: user?.name || '',
          email: user?.email || '',
          location: 'Singapore',
          aboutMe: '',
          skillsOffered: [],
          skillsWanted: []
        });
        setError(null);
      } else {
        setError(`Failed to load profile data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newProfileData) => {
    try {
      setLoading(true);
      setError(null);

      const profilePayload = {
        user_id: user.id,
        full_name: newProfileData.fullName,
        email: newProfileData.email,
        location: newProfileData.location,
        about_me: newProfileData.aboutMe,
        profile_image_url: newProfileData.profileImageUrl,
        skills_offered: newProfileData.skillsOffered,
        skills_wanted: newProfileData.skillsWanted,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profilePayload, { 
          onConflict: 'user_id',
          returning: 'minimal'
        });

      if (error) {
        // Handle table not found error
        if (error.code === '42P01' || error.message?.includes('relation "profiles" does not exist')) {
          console.warn('Profiles table does not exist. Please run the SQL setup in Supabase.');
          // For now, just update local state
          setProfileData(newProfileData);
          return { 
            success: true, 
            warning: 'Profile saved locally. Database table not found - please set up Supabase table.' 
          };
        }
        throw error;
      }

      // Update local state
      setProfileData(newProfileData);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    profileData,
    updateProfile,
    loading,
    error,
    refreshProfile: loadProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
