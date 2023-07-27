import React, { useEffect, useState, useRef } from "react";
import './Chat.css'

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesCount, setMessagesCount] = useState(0)
  const chatMessagesRef = useRef(null);

  useEffect(()=>{
    receiveMessage();
  },[messagesCount])

  useEffect(() => {
    const chatMessagesContainer = chatMessagesRef.current;
    const newMessageElement = chatMessagesContainer.lastChild;
    
    if (newMessageElement) {
      newMessageElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      const newMessage = {
        sender: "User1",
        content: currentMessage,
      };
      setMessages([...messages, newMessage]);
      setMessagesCount(messagesCount + 1)
      setCurrentMessage("");
    }
  };

  const receiveMessage = () => {
      const newMessage = {
        sender: "User2",
        content: "Message received",
      };
      setMessages([...messages, newMessage]);
      setCurrentMessage("");

    };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage()

    }
  };


  return (
    <div className="chat-container">
      <div className="chat-messages" ref={chatMessagesRef}>
      {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender === "User1" ? "user1" : "user2"}`}
          >
            <span className="content">{message.content}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
