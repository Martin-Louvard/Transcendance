import React from 'react';
import { ChatBox, ChatBoxProps } from './Types.ts'


const SideMenuChatBox: React.FC<ChatBoxProps> = ({ chatBoxes, onChatBoxClick }) => {
  return (
    <div className="side-menu">
      <h2>Chat List</h2>
      <ul>
        {chatBoxes.map((chatBoxes) => (
          <li key={chatBoxes.id} onClick={() => onChatBoxClick(chatBoxes.id)}>
            {chatBoxes.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenuChatBox;
