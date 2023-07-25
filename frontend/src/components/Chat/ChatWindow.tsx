import React from 'react';
import { ChatWindowProps as Props } from './Types.ts'

const ChatWindow: React.FC<Props> = ({ isOpen, onClose, chatBoxName, messagesList }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="chat-window">
      <button onClick={onClose}>close</button>
      <h3>{chatBoxName}</h3>
      <ul>
        {messagesList.map((mess) => (
          <li className="message"><strong>{mess.senderName}</strong>{mess.content}</li>
        ))}
      </ul>
    </div>
  );
};
export default ChatWindow;
