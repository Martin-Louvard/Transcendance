import { Popup } from 'reactjs-popup';
import "reactjs-popup/dist/index.css";
import { ChatChannels } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import UserListItem from "./userItemManagement.tsx";
import ChatSettings from "./chatSettings.tsx";
import React, { useState, useEffect } from 'react';
import LeaveChatButton from "./leaveChatButton.tsx";

const contentStyle = { background: '#000' };
const arrowStyle = { color: '#000' }; 
const PopupManagement = ({chat, isOpen, setIsOpen}: {chat: ChatChannels | undefined; isOpen: boolean; setIsOpen:React.Dispatch<React.SetStateAction<boolean>>} ) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const [isDefine, setIsDefine] = useState<boolean>(false);

  useEffect(() => {
    if (chat !== undefined && currentUser !== undefined) {
      setIsDefine(chat.owner.id === currentUser.id);
    }
  }, [chat, currentUser]);

  return (
    <Popup
        open={isOpen}
        closeOnDocumentClick={false}
        onClose={() => setIsOpen(false)}
        {...{contentStyle, arrowStyle }}  
    >
      <div className="management-chat-popup">
        {isDefine  ?  <ChatSettings chat={chat!}/>: ""}
      </div>
      <ul>
        {chat?.participants.map((user)=>{
          if (currentUser?.id !== user?.id)
            return (<UserListItem key={user.id} user={user} chat={chat} />);
          return null;
      })}
    </ul>
    <div className="popup-leave-chat-button"><LeaveChatButton chat={chat!} setIsOpen={setIsOpen} /></div>
    </Popup>
  );
};
export default PopupManagement;
