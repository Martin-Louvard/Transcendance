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
  const currentOpenedChat = useAppSelector((state) => state.session.OpenedChatChannels.find(
    (chann) => chann.id === chat?.id));

  useEffect(() => {
    if (currentOpenedChat !== undefined && currentUser !== undefined) {
      setIsDefine(currentOpenedChat.owner.id === currentUser.id);
    }
  }, [currentOpenedChat, currentUser]);

  return (
    <Popup
        open={isOpen}
        closeOnDocumentClick={true}
        onClose={() => setIsOpen(false)}
        {...{contentStyle, arrowStyle }}  
    >
      <div className="management-currentOpenedChat-popup">
        {isDefine  ?  <ChatSettings chat={currentOpenedChat!}/>: ""}
      </div>
      <ul>
        {currentOpenedChat?.participants.map((user)=>{
          if (currentUser?.id !== user?.id)
            return (<UserListItem key={user.id} user={user} chat={currentOpenedChat} />);
          return null;
      })}
    </ul>
    <div className="popup-leave-currentOpenedChat-button"><LeaveChatButton chat={currentOpenedChat!} setIsOpen={setIsOpen} /></div>
    </Popup>
  );
};
export default PopupManagement;
