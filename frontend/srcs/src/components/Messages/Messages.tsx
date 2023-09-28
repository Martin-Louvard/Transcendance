import React, { useRef, useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { Friendships, Message } from "../../Types";

interface MessagesProps {
  messages: Message[] | undefined;
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const user = useAppSelector((state) => state.session.user);
  const friendships = useAppSelector((state) => state.session.friendships)
  const [blockedFriendships, setBlockedFriendships] = useState<Friendships[]>()
  const [blockedUsersIds, setBlockedUsersIds] = useState<number[]>([])

  useEffect(()=>{
    if (friendships)
      setBlockedFriendships(friendships?.filter(f => f.status === "BLOCKED"))
  },[friendships])

  useEffect(()=>{
    if (blockedFriendships)
    setBlockedUsersIds(blockedFriendships.map(f=>{
      return f.user_id === user?.id ? f.friend_id : f.user_id
    }))
  },[blockedFriendships])

  useEffect(() => {
    const chatMessagesContainer = chatMessagesRef.current;

    if (chatMessagesContainer && messages?.length) {
      const newMessageElement = chatMessagesContainer.lastElementChild as HTMLDivElement;
      if (newMessageElement) {
        newMessageElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  return (
    <div className="chat-messages" ref={chatMessagesRef}>
      {messages?.map((message, index) => (
        !blockedUsersIds.includes(message.senderId) ? (
      <>
        {   
          messages[index - 1] && message.createdAt.substring(0, 10) !== messages[index - 1].createdAt.substring(0, 10) || !messages[index  -1] ? 
          <span className="message-date"> {message.createdAt.substring(0, 10)}</span> : ""
        }
        <div key={index} className={`message-wrapper  ${
          message.senderId === user?.id ? "left" : "right"
        }`} >
        <div
         
          className={`chat-message ${
            message.senderId === user?.id ? "user1" : "user2"
          }`}
        >
          <span className="content">{message.content}</span>
        </div>
       
      </div>

        {
          messages[index + 1] && message.senderId !== messages[index + 1].senderId || !messages[index +1] ? 
        <div className={`message-infos  ${
          message.senderId === user?.id ? "left" : "right"
        }`}>
          <img className="sender-profile-pic" src={ 'http://localhost:3001/users/avatar/' +
              message.sender.username +
              '/' + message.sender.avatar.split('/').reverse()[0]}/>
          <span className="message-username">{message.sender.username}</span>
          <span className="message-date"> {message.createdAt.substring(11, 16)}</span>
        </div>
        : ""
        }
      </>
    ) : ( "" )
    ))} 
        </div>
  );
};

export default Messages;
