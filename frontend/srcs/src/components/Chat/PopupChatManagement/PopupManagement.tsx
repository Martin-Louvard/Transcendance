import { Popup } from 'reactjs-popup';
import { ChatChannels } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import UserListItem from "./userItemManagement.tsx";
import ChatSettings from "./chatSettings.tsx";
import React, { useState, useEffect } from 'react';
import LeaveChatButton from "./leaveChatButton.tsx";
import AddParticipants from "./addParticipants.tsx";

let contentStyle = { background: 'transparent', border: "none"};
const arrowStyle = { color: '#000' }; 
const PopupManagement = ({chat, isOpen, setIsOpen}: {chat: ChatChannels | undefined; isOpen: boolean; setIsOpen:React.Dispatch<React.SetStateAction<boolean>>} ) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const [isDefine, setIsDefine] = useState<boolean>(false);
  const currentOpenedChat = useAppSelector((state) => state.session.OpenedChatChannels.find(
    (chann) => chann.id === chat?.id));
  useEffect(() => {
    if (currentOpenedChat !== undefined && currentUser !== undefined) {
      setIsDefine(currentOpenedChat?.owner?.id === currentUser.id);
    }
  }, [currentOpenedChat, currentUser]);

  useEffect(() => {
    if (!currentOpenedChat?.participants?.filter((user) => user.id === currentUser?.id).length)
      setIsOpen(false);
  }, [currentOpenedChat]);

  return (
    <Popup
        open={isOpen}
        closeOnDocumentClick={false}
        onClose={() => setIsOpen(false)}
        {...{ contentStyle, arrowStyle }}  
    >
      <div className='chat-popup'>
        <button className='close-popup' onClick={() =>{setIsOpen(false)}}>x</button>
        <div className='popup-top'>
        <div className="management-currentOpenedChat-popup">
            {isDefine  ?  <ChatSettings chat={currentOpenedChat!}/>: ""}
          </div>
          <AddParticipants chat={currentOpenedChat!} />
      </div>
      <ul>
        {currentOpenedChat?.participants?.map((user)=>{
          if (currentUser?.id !== user?.id)
            return (<UserListItem key={user.id} user={user} chat={currentOpenedChat} setIsOpen={setIsOpen} />);
          return null;
      })}
    </ul>
    <div className="popup-leave-currentOpenedChat-button"><LeaveChatButton chat={currentOpenedChat!} setIsOpen={setIsOpen} /></div>

    </div>
    </Popup>
  );
};
export default PopupManagement;
