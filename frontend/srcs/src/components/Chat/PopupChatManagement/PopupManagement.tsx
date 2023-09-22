import { Popup } from 'reactjs-popup';
import "reactjs-popup/dist/index.css";
import { ChatChannels } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import UserListItem from "./userItemManagement.tsx";
import ChatSettings from "./chatSettings.tsx";
import React, { useState } from 'react';

const PopupManagement = ({chat, isOpen, setIsOpen}: {chat: ChatChannels | undefined; isOpen: boolean; setIsOpen:React.Dispatch<React.SetStateAction<boolean>>} ) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const [isDefine, setIsDefine] = useState<boolean>(false);

  if (chat === undefined)
    return ("");

  console.log(chat.Owner);
  console.log(chat.Owner.id);
  if (currentUser !== undefined){
    if (chat?.Owner.id === currentUser.id)
      setIsDefine(true);
  }
  return (
    <Popup
        open={isOpen}
        closeOnDocumentClick={false}
        onClose={() => setIsOpen(false)}
    >
      <div className="management-chat-popup">
        {isDefine  ?  <ChatSettings chat={chat}/>: ""}
      </div>
      <ul>
        {chat?.participants.map((user)=>{
          if (currentUser?.id !== user?.id)
            return (<UserListItem user={user} chat={chat} />);
      })}
      </ul>
    </Popup>
  );
};
export default PopupManagement;
