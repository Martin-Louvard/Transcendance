import React from 'react';

interface Chatbox {
  id: number;
  name: string;
}

interface ChatBoxListProps {
  chatboxes: Chatbox[];
  onSelectChatbox: (chatbox: Chatbox) => void;
}

const ChatBoxList: React.FC<ChatBoxListProps> = ({ chatboxes, onSelectChatbox }) => {
  return (
    <div>
      <h2>ChatBoxes</h2>
      <ul>
        {chatboxes.map((chatbox) => (
          <li key={chatbox.id} onClick={() => onSelectChatbox(chatbox)}>
            {chatbox.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatBoxList;
