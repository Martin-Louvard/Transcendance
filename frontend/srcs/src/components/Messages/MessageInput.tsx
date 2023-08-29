import React, { useState, KeyboardEvent } from "react";

interface MessageInputProps {
  handleSendMessage: (currentMessage: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ handleSendMessage }) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(currentMessage);
      setCurrentMessage("");
    }
  };

  return (
    <div className="chat-input">
      <textarea
        placeholder="Type a message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={() => {
          handleSendMessage(currentMessage);
          setCurrentMessage("");
        }}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
