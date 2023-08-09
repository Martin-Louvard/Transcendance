import React from "react";
import { useState } from "react";

const MessageInput = ({handleSendMessage}: {handleSendMessage: (currentMessage: string) => void}) =>{
    const [currentMessage, setCurrentMessage] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          handleSendMessage(currentMessage)
        }
      };

    return <>
    <div className="chat-input">
        <textarea
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => handleSendMessage(currentMessage)}>Send</button>
      </div>
    </>
}

export default MessageInput