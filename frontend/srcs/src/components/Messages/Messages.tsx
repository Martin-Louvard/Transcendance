import React, {useRef, useEffect} from "react";

const Messages = ({messages}: {messages:string[]}) =>{
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        const chatMessagesContainer = chatMessagesRef.current;
        if (!chatMessagesContainer)
            return
        const newMessageElement = chatMessagesContainer.lastChild;
        
        if (newMessageElement) {
          newMessageElement.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]);

    return <>
    <div className="chat-messages" ref={chatMessagesRef}>
      {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message user1 `}
          >
            <span className="content">{message}</span>
          </div>
        ))}
      </div>
    </>
}

export default Messages