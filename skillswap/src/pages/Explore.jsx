import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaBullseye, FaMapMarkerAlt, FaUserPlus, FaSearch } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import '../styles/Explore.css';

const Explore = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch ALL users' profiles from Supabase (no filtering)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('🚀 Starting fetchUsers...');
        console.log('🔍 Current user context:', user);
        console.log('🔍 User ID:', user?.id);
        console.log('🔍 User email:', user?.email);
        
        setLoading(true);
        setError(null);

        // Get all profiles from the database and filter out current user
        console.log('📡 Querying Supabase profiles table...');
        
        // First try a simple query with no ordering
        const { data: simpleData, error: simpleError } = await supabase
          .from('profiles')
          .select('*');
          
        console.log('🔍 Simple query (no ordering):');
        console.log('- Data:', simpleData);
        console.log('- Length:', simpleData?.length || 0);
        console.log('- Error:', simpleError);
        
        // Now try with ordering
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('📊 Raw Supabase response:');
        console.log('- Data:', data);
        console.log('- Error:', error);
        console.log('- Data length:', data?.length || 0);

        if (error) {
          console.error('❌ Supabase query error:', error);
          throw error;
        }

        if (data && data.length > 0) {
          console.log('📋 Individual profiles:');
          data.forEach((profile, index) => {
            console.log(`Profile ${index + 1}:`, {
              id: profile.id,
              user_id: profile.user_id,
              full_name: profile.full_name,
              email: profile.email,
              location: profile.location,
              skills_offered: profile.skills_offered,
              skills_wanted: profile.skills_wanted,
              created_at: profile.created_at
            });
            console.log(`Profile ${index + 1} FULL OBJECT:`, profile);
          });
          
          console.log('🔍 Expected profiles from your screenshot:');
          console.log('- Should see: David (test2@gmail.com)');
          console.log('- Should see: ben (test@gmail.com)'); 
          console.log('- Should see: ziyang (ziyang@gmail.com)');
          console.log(`- Actually got: ${data.length} profile(s)`);
        } else {
          console.log('⚠️ No profiles found in database');
        }

        // Transform the data to match the component's expected format
        console.log('🔄 Transforming data...');
        const transformedUsers = (data || [])
          .filter(profile => profile.user_id !== user?.id) // Filter out the current user
          .map(profile => ({
            id: profile.id,
            name: profile.full_name || 'Anonymous User',
            location: profile.location || 'Location not specified',
            profileImage: profile.profile_image_url || "https://via.placeholder.com/80",
            skillsOffered: profile.skills_offered || [],
            skillsWanted: profile.skills_wanted || [],
            isCurrentUser: false // Always false since we filtered out the current user
          }));

        console.log('✨ Transformed users (excluding current user):', transformedUsers);
        console.log('✨ Setting users state with', transformedUsers.length, 'users (current user filtered out)');

        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch all users regardless of authentication status
    fetchUsers();
  }, [user]);

  const handleConnect = async (userName, userId) => {
    // Check if user is logged in
    if (!isAuthenticated || !user) {
      // Show alert and redirect to login
      alert('Please log in to connect with other users!');
      navigate('/login');
      return;
    }

    try {
      // Check if conversation already exists
      const { data: existingConversation, error: findError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${userId}),and(participant_1.eq.${userId},participant_2.eq.${user.id})`)
        .single();

      // If no conversation exists, create one
      if (!existingConversation) {
        const { error: createError } = await supabase
          .from('conversations')
          .insert({
            participant_1: user.id,
            participant_2: userId
          });

        if (createError) {
          console.error('Error creating conversation:', createError);
          // Continue to chat even if conversation creation fails
        }
      }

      // Navigate to chat with the selected user
      navigate('/chat', { 
        state: { 
          chatWithUser: userName,
          chatWithUserId: userId,
          currentUser: user.name || user.email
        }
      });
    } catch (error) {
      console.error('Error handling connect:', error);
      // Still navigate to chat even if there's an error
      navigate('/chat', { 
        state: { 
          chatWithUser: userName,
          chatWithUserId: userId,
          currentUser: user.name || user.email
        }
      });
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!searchTerm.trim()) return true; // Show all users if no search term
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search through skills offered (what they can teach)
    const hasMatchingSkillOffered = user.skillsOffered.some(skill => 
      skill.name.toLowerCase().includes(searchLower)
    );
    
    // Search through skills wanted (what they want to learn)
    const hasMatchingSkillWanted = user.skillsWanted.some(skill => 
      skill.name.toLowerCase().includes(searchLower)
    );
    
    // Also search in user name and location
    const hasMatchingInfo = user.name.toLowerCase().includes(searchLower) ||
                           user.location.toLowerCase().includes(searchLower);
    
    return hasMatchingSkillOffered || hasMatchingSkillWanted || hasMatchingInfo;
  });

  // Debug: Log current component state
  console.log('🎨 Render state:', {
    loading,
    error,
    usersLength: users.length,
    filteredUsersLength: filteredUsers.length,
    searchTerm,
    users: users
  });

  return (
    <div className="explore">
      <div className="explore-header">
        <h1>Explore Skills</h1>
      </div>

      {/* Search Filter */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for skills you want to learn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} 
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          fontSize: '1.1rem',
          color: '#666'
        }}>
          Loading profiles...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          fontSize: '1.1rem',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          {error}
        </div>
      )}

      {/* No Users State */}
      {!loading && !error && users.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          margin: '2rem 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: '#495057', marginBottom: '1rem' }}>No Profiles Found</h3>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            No user profiles have been created yet.
          </p>
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '1.5rem', 
            borderRadius: '8px',
            border: '1px solid #bbdefb'
          }}>
            <p style={{ color: '#1976d2', margin: '0', fontWeight: '500' }}>
              💡 <strong>Get started:</strong> Create your profile by going to "Edit Profile" 
              and filling out your skills and information!
            </p>
          </div>
        </div>
      )}

      {/* No Search Results State */}
      {!loading && !error && users.length > 0 && filteredUsers.length === 0 && searchTerm && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          margin: '2rem 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#495057', marginBottom: '1rem' }}>No Results Found</h3>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            No users found with skills matching "{searchTerm}".
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Users Grid */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="users-grid">
          {filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              {/* User Header */}
              <div className="user-header">
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="user-image"
                />
                <div className="user-info">
                  <h3>
                    {user.name}
                    {user.isCurrentUser && (
                      <span style={{ 
                        color: '#007bff', 
                        fontSize: '0.8em',
                        fontWeight: 'normal',
                        marginLeft: '8px'
                      }}>
                        (You)
                      </span>
                    )}
                  </h3>
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
                  {user.skillsOffered.length > 0 ? (
                    user.skillsOffered.map((skill, index) => (
                      <div key={index} className="skill-tag skill-offered">
                        {skill.name} <span className="skill-level">{skill.level}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>No skills listed</p>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div className="user-section">
                <h4 className="section-title">
                  <FaBullseye className="section-icon" /> Skills I Want to Learn
                </h4>
                <div className="skill-list">
                  {user.skillsWanted.length > 0 ? (
                    user.skillsWanted.map((skill, index) => (
                      <div key={index} className="skill-tag skill-wanted">
                        {skill.name} <span className="skill-level">{skill.level}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>No skills listed</p>
                  )}
                </div>
              </div>

              {/* Connect Button */}
              <button 
                className="connect-button"
                onClick={() => handleConnect(user.name, user.id)}
                disabled={user.isCurrentUser}
                style={{
                  opacity: user.isCurrentUser ? 0.6 : 1,
                  cursor: user.isCurrentUser ? 'not-allowed' : 'pointer'
                }}
              >
                <FaUserPlus className="connect-icon" />
                {user.isCurrentUser ? 'Your Profile' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
