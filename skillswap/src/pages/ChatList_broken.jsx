import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSearch, FaComments } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import '../styles/ChatList.css';

const ChatList = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadChats = async () => {
    setLoading(true);
    
    try {
      if (!user?.id) {
        console.error('No user ID available');
        setChats([]);
        return;
      }

      console.log('Loading conversations for user:', user.id);

      // Fetch conversations where the current user is a participant
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_1,
          participant_2,
          updated_at,
          messages (
            id,
            content,
            created_at,
            sender_id,
            read_at
          )
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (convError) {
        console.error('Error fetching conversations:', convError);
        setChats([]);
        return;
      }

      console.log('Raw conversations data:', conversations);

      if (!conversations || conversations.length === 0) {
        console.log('No conversations found');
        setChats([]);
        return;
      }

      // Process conversations to get chat list data
      const chatPromises = conversations.map(async (conversation) => {
        // Determine the other participant
        const otherParticipantId = conversation.participant_1 === user.id 
          ? conversation.participant_2 
          : conversation.participant_1;

        // Get the other participant's profile
        const { data: otherUserProfile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, profile_image_url')
          .eq('user_id', otherParticipantId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Get the latest message
        const { data: latestMessage, error: messageError } = await supabase
          .from('messages')
          .select('content, created_at, sender_id, read_at')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (messageError && messageError.code !== 'PGRST116') {
          console.error('Error fetching latest message:', messageError);
        }

        // Count unread messages (messages sent by other user that current user hasn't read)
        const { count: unreadCount, error: unreadError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conversation.id)
          .eq('sender_id', otherParticipantId)
          .is('read_at', null);

        if (unreadError) {
          console.error('Error counting unread messages:', unreadError);
        }

        return {
          id: conversation.id,
          userId: otherParticipantId,
          name: otherUserProfile?.full_name || 'Anonymous User',
          avatar: otherUserProfile?.profile_image_url || null,
          lastMessage: latestMessage?.content || 'No messages yet',
          timestamp: latestMessage?.created_at ? new Date(latestMessage.created_at) : new Date(conversation.updated_at),
          unreadCount: unreadCount || 0,
          isOnline: false // You can implement online status later with presence
        };
      });

      const chatList = await Promise.all(chatPromises);
      console.log('Processed chat list:', chatList);
      
      // Sort by timestamp (most recent first)
      chatList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setChats(chatList);
    } catch (error) {
      console.error('Error loading chats:', error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

        if (convError) {
          console.error('Error fetching conversations:', convError);
          setChats([]);
          return;
        }

        console.log('Raw conversations data:', conversations);

        if (!conversations || conversations.length === 0) {
          console.log('No conversations found');
          setChats([]);
          return;
        }

        // Process conversations to get chat list data
        const chatPromises = conversations.map(async (conversation) => {
          // Determine the other participant
          const otherParticipantId = conversation.participant_1 === user.id 
            ? conversation.participant_2 
            : conversation.participant_1;

          // Get the other participant's profile
          const { data: otherUserProfile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, profile_image_url')
            .eq('user_id', otherParticipantId)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          // Get the latest message
          const { data: latestMessage, error: messageError } = await supabase
            .from('messages')
            .select('content, created_at, sender_id, read_at')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (messageError && messageError.code !== 'PGRST116') {
            console.error('Error fetching latest message:', messageError);
          }

          // Count unread messages (messages sent by other user that current user hasn't read)
          const { count: unreadCount, error: unreadError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .eq('sender_id', otherParticipantId)
            .is('read_at', null);

          if (unreadError) {
            console.error('Error counting unread messages:', unreadError);
          }

          return {
            id: conversation.id,
            userId: otherParticipantId,
            name: otherUserProfile?.full_name || 'Anonymous User',
            avatar: otherUserProfile?.profile_image_url || null,
            lastMessage: latestMessage?.content || 'No messages yet',
            timestamp: latestMessage?.created_at ? new Date(latestMessage.created_at) : new Date(conversation.updated_at),
            unreadCount: unreadCount || 0,
            isOnline: false // You can implement online status later with presence
          };
        });

        const chatList = await Promise.all(chatPromises);
        console.log('Processed chat list:', chatList);
        
        // Sort by timestamp (most recent first)
        chatList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setChats(chatList);
      } catch (error) {
        console.error('Error loading chats:', error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user, isAuthenticated, navigate]);

  // Real-time subscription for chat updates
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    console.log('Setting up real-time subscription for chat list updates');

    // Subscribe to new messages to update chat list in real-time
    const subscription = supabase
      .channel('chat-list-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message detected, refreshing chat list');
          // Reload chats when new messages arrive
          // In a production app, you might want to optimize this to only update the affected conversation
          setTimeout(() => {
            loadChats();
          }, 1000); // Small delay to ensure data consistency
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up chat list subscription');
      supabase.removeChannel(subscription);
    };
  }, [user, isAuthenticated]);

  const loadChats = async () => {
    setLoading(true);
    
    try {
      if (!user?.id) {
        console.error('No user ID available');
        setChats([]);
        return;
      }

      console.log('Loading conversations for user:', user.id);

      // Fetch conversations where the current user is a participant
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_1,
          participant_2,
          updated_at,
          messages (
            id,
            content,
            created_at,
            sender_id,
            read_at
          )
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (convError) {
        console.error('Error fetching conversations:', convError);
        setChats([]);
        return;
      }

      console.log('Raw conversations data:', conversations);

      if (!conversations || conversations.length === 0) {
        console.log('No conversations found');
        setChats([]);
        return;
      }

      // Process conversations to get chat list data
      const chatPromises = conversations.map(async (conversation) => {
        // Determine the other participant
        const otherParticipantId = conversation.participant_1 === user.id 
          ? conversation.participant_2 
          : conversation.participant_1;

        // Get the other participant's profile
        const { data: otherUserProfile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, profile_image_url')
          .eq('user_id', otherParticipantId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Get the latest message
        const { data: latestMessage, error: messageError } = await supabase
          .from('messages')
          .select('content, created_at, sender_id, read_at')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (messageError && messageError.code !== 'PGRST116') {
          console.error('Error fetching latest message:', messageError);
        }

        // Count unread messages (messages sent by other user that current user hasn't read)
        const { count: unreadCount, error: unreadError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conversation.id)
          .eq('sender_id', otherParticipantId)
          .is('read_at', null);

        if (unreadError) {
          console.error('Error counting unread messages:', unreadError);
        }

        return {
          id: conversation.id,
          userId: otherParticipantId,
          name: otherUserProfile?.full_name || 'Anonymous User',
          avatar: otherUserProfile?.profile_image_url || null,
          lastMessage: latestMessage?.content || 'No messages yet',
          timestamp: latestMessage?.created_at ? new Date(latestMessage.created_at) : new Date(conversation.updated_at),
          unreadCount: unreadCount || 0,
          isOnline: false // You can implement online status later with presence
        };
      });

      const chatList = await Promise.all(chatPromises);
      console.log('Processed chat list:', chatList);
      
      // Sort by timestamp (most recent first)
      chatList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setChats(chatList);
    } catch (error) {
      console.error('Error loading chats:', error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chat) => {
    navigate('/chat', {
      state: {
        chatWithUser: chat.name,
        chatWithUserId: chat.userId,
        currentUser: user?.name || user?.email
      }
    });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const chatTime = new Date(timestamp);
    const diffInHours = Math.abs(now - chatTime) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="chat-list-container">
        <div className="chat-list-header">
          <h1>Chats</h1>
        </div>
        <div className="loading-state">
          <FaComments className="loading-icon" />
          <p>Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      {/* Header */}
      <div className="chat-list-header">
        <h1>Chats</h1>
        <p>Your conversations with other SkillSwap users</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="chat-list">
        {filteredChats.length === 0 ? (
          <div className="empty-state">
            <FaComments className="empty-icon" />
            <h3>No conversations yet</h3>
            <p>Start connecting with other users to begin chatting!</p>
            <button 
              className="explore-button"
              onClick={() => navigate('/explore')}
            >
              Explore Users
            </button>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() => handleChatClick(chat)}
            >
              <div className="chat-avatar">
                {chat.avatar ? (
                  <img src={chat.avatar} alt={chat.name} />
                ) : (
                  <FaUser />
                )}
                {chat.isOnline && <div className="online-indicator" />}
              </div>

              <div className="chat-info">
                <div className="chat-header">
                  <h3 className="chat-name">{chat.name}</h3>
                  <span className="chat-time">{formatTime(chat.timestamp)}</span>
                </div>
                <div className="chat-preview">
                  <p className="last-message">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="unread-count">{chat.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
