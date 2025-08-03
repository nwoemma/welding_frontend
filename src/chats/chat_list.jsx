// src/chats/chat_list.jsx
import React, { useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

function ChatList() {
  const [messages, setMessages] = useState([
    {
      message: "Welding team communications",
      sender: "System",
      direction: "incoming",
      position: "single"
    }
  ]);

  const handleSend = (newMessage) => {
    setMessages([...messages, {
      message: newMessage,
      sender: "You",
      direction: "outgoing",
      position: "single"
    }]);
  };

  return (
    <div style={{ height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((msg, i) => (
              <Message key={i} model={msg} />
            ))}
          </MessageList>
          <MessageInput onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatList;