import React from 'react';

interface Message {
  id: number;
  text: string;
  sender: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.sender}</strong>: {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
