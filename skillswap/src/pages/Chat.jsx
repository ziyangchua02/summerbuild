import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLocationArrow, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import '../styles/Chat.css';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  
  // Get chat data from navigation state
  const chatData = location.state;
  const chatWithUser = chatData?.chatWithUser || 'Unknown User';
  const chatWithUserId = chatData?.chatWithUserId;
  const currentUser = user?.name || user?.email || 'You';

  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatWithUserProfile, setChatWithUserProfile] = useState(null);

  // Load or create conversation and fetch messages
  useEffect(() => {
    const initializeChat = async () => {
      if (!chatData || !user?.id || !chatWithUserId) return;

      try {
        setLoading(true);
        console.log('Initializing chat between:', user.id, 'and', chatWithUserId);

        // Fetch the profile data for the user we're chatting with
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', chatWithUserId)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else {
          console.log('Fetched profile data:', profileData);
          setChatWithUserProfile(profileData);
        }

        // First, try to find existing conversation
        const { data: existingConversation, error: findError } = await supabase
          .from('conversations')
          .select('id')
          .or(`and(participant_1.eq.${user.id},participant_2.eq.${chatWithUserId}),and(participant_1.eq.${chatWithUserId},participant_2.eq.${user.id})`)
          .single();

        let convId = existingConversation?.id;

        // If no conversation exists, create one
        if (!convId) {
          console.log('Creating new conversation');
          const { data: newConversation, error: createError } = await supabase
            .from('conversations')
            .insert({
              participant_1: user.id,
              participant_2: chatWithUserId
            })
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating conversation:', createError);
            return;
          }

          convId = newConversation.id;
          console.log('Created conversation with ID:', convId);
        } else {
          console.log('Found existing conversation with ID:', convId);
        }

        setConversationId(convId);

        // Fetch messages for this conversation
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          setMessages([]);
        } else {
          console.log('Loaded messages:', messagesData);
          const formattedMessages = messagesData.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.sender_id === user.id ? currentUser : chatWithUser,
            timestamp: new Date(msg.created_at),
            isCurrentUser: msg.sender_id === user.id
          }));
          setMessages(formattedMessages);

          // Mark messages as read (messages from other user)
          const unreadMessageIds = messagesData
            .filter(msg => msg.sender_id !== user.id && !msg.read_at)
            .map(msg => msg.id);

          if (unreadMessageIds.length > 0) {
            await supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .in('id', unreadMessageIds);
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [chatData, user, chatWithUserId, chatWithUser, currentUser]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!conversationId) return;

    console.log('Setting up real-time subscription for conversation:', conversationId);

    const subscription = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('Received new message:', payload.new);
          
          // Only add the message if it's from the other user
          if (payload.new.sender_id !== user?.id) {
            const newMessage = {
              id: payload.new.id,
              text: payload.new.content,
              sender: chatWithUser,
              timestamp: new Date(payload.new.created_at),
              isCurrentUser: false
            };

            setMessages(prev => [...prev, newMessage]);

            // Mark as read immediately since user is in the chat
            supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', payload.new.id)
              .then(({ error }) => {
                if (error) {
                  console.error('Error marking message as read:', error);
                }
              });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(subscription);
    };
  }, [conversationId, user, chatWithUser]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Redirect if no chat data
  useEffect(() => {
    if (!chatData) {
      navigate('/chats');
    }
  }, [chatData, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || !user?.id) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    try {
      // Save message to database
      const { data: savedMessage, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: messageText
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error sending message:', error);
        setNewMessage(messageText); // Restore message if failed
        return;
      }

      // Add message to local state for immediate display
      const formattedMessage = {
        id: savedMessage.id,
        text: messageText,
        sender: currentUser,
        timestamp: new Date(savedMessage.created_at),
        isCurrentUser: true
      };

      setMessages(prev => [...prev, formattedMessage]);
      
      console.log('Message sent successfully:', savedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message if failed
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (!chatData) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <button 
            className="back-button"
            onClick={() => navigate('/chats')}
            aria-label="Go back to chat list"
          >
            <FaArrowLeft />
          </button>
          <div className="chat-user-info">
            <div className="chat-user-details">
              <h3 className="chat-user-name">Loading...</h3>
            </div>
          </div>
        </div>
        <div className="messages-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#8b9faa',
            fontSize: '14px'
          }}>
            Loading messages...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-interface">
        {/* Chat Header */}
        <div className="chat-header">
          <button 
            className="back-button"
            onClick={() => navigate('/chats')}
            aria-label="Go back to chat list"
          >
            <FaArrowLeft />
          </button>
          
          <div className="chat-user-info">
            <div className="chat-avatar">
              {chatWithUserProfile?.profileImage ? (
                <img 
                  src={chatWithUserProfile.profileImage} 
                  alt={chatWithUser}
                  className="avatar-image"
                />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="chat-user-details">
              <h3 className="chat-user-name">{chatWithUser}</h3>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isCurrentUser ? 'message-sent' : 'message-received'}`}
              >
                <div className="message-content">
                  <span className="message-text">{message.text}</span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <form className="message-input-container" onSubmit={handleSendMessage}>
          <div className="message-input-wrapper">
            <input
              type="text"
              className="message-input"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="send-button"
              disabled={!newMessage.trim()}
            >
              <FaLocationArrow />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
