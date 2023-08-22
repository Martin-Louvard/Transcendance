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
  const [blockedUsersIds, setBlockedUsersIds] = useState<number[]>()

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
        blockedUsersIds?.some(id => id === message.id) ? null:
        <div
          key={index}
          className={`chat-message ${
            message.senderId === user?.id ? "user1" : "user2"
          }`}
        >
          <span className="content">{message.content}</span>
        </div>
      ))}
    </div>
  );
};

export default Messages;