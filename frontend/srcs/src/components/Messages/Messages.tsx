import React, {useRef, useEffect} from "react";
import { useAppSelector } from "../../hooks";
const Messages = ({messages}: {messages:Object[]}) =>{
    const chatMessagesRef = useRef(null);
    const user = useAppSelector((state)=>state.user)

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
            className={`chat-message ${message.senderId == user.id ? 'user1' : 'user2'} `}
          >
            <span className="content">{message.content}</span>
          </div>
        ))}
      </div>
    </>
}

export default Messages