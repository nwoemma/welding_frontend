import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './WeldingChat.css';

const WeldingChat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [teams, setTeams] = useState([]); // Initialize as empty array
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch teams and messages from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const teamsRes = await axios.get('/api/teams');
        
        // Ensure we have an array
        if (Array.isArray(teamsRes?.data)) {
          setTeams(teamsRes.data);
        } else {
          console.error('Teams data is not an array:', teamsRes.data);
          setTeams([]); // Fallback to empty array
        }
        
        const messagesRes = await axios.get('/api/messages');
        setMessages(messagesRes.data || {});
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, messages]);

  const sendMessage = async () => {
    if (!message.trim() || !activeChat) return;
    
    try {
      const newMessage = {
        teamId: activeChat,
        sender: 'me',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Optimistic update
      setMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), newMessage]
      }));

      // Send to backend
      await axios.post('/api/messages', newMessage);
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Rollback optimistic update if needed
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading welding teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="welding-chat-app">
      {/* Sidebar */}
      <div className={`sidebar ${isMobile && activeChat ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <h2>Welding Teams</h2>
        </div>
        
        <div className="team-list">
          {Array.isArray(teams) && teams.map(team => (
            <div 
              key={team.id} 
              className={`team-item ${activeChat === team.id ? 'active' : ''}`}
              onClick={() => setActiveChat(team.id)}
            >
              <div className={`team-avatar ${team.status}`}>
                {team.name.charAt(0)}
              </div>
              <div className="team-info">
                <h3>{team.name}</h3>
                <p>{team.lastMessage}</p>
              </div>
              {team.unread > 0 && <span className="unread-count">{team.unread}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`chat-area ${isMobile && !activeChat ? 'hidden' : ''}`}>
        {activeChat ? (
          <>
            <div className="chat-header">
              {isMobile && (
                <button className="back-button" onClick={() => setActiveChat(null)}>
                  &larr;
                </button>
              )}
              <div className="chat-title">
                <h3>{teams.find(t => t.id === activeChat)?.name}</h3>
                <span className={`status ${teams.find(t => t.id === activeChat)?.status}`}>
                  {teams.find(t => t.id === activeChat)?.status}
                </span>
              </div>
            </div>

            <div className="messages">
              {messages[activeChat]?.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <div className="message-content">
                    <p>{msg.text}</p>
                    <span className="message-time">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a team to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeldingChat;