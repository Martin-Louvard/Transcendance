import { Popup } from 'reactjs-popup';
import "reactjs-popup/dist/index.css";
import { ChatChannels } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import UserListItem from "./userItemManagement.tsx";
import ChatSettings from "./chatSettings.tsx";
import React from 'react';

const PopupManagement = ({chat, isOpen, setIsOpen}: {chat: ChatChannels | undefined; isOpen: boolean; setIsOpen:React.Dispatch<React.SetStateAction<boolean>>} ) => {
  const currentUser = useAppSelector((state) => state.session.user);
  if (chat === undefined)
    return ("");

  return (
    <Popup
        open={isOpen}
        closeOnDocumentClick={false}
        onClose={() => setIsOpen(false)}
    >
      <div className="management-chat-popup">
        {chat?.Owner.id === currentUser.?id ?  <ChatSettings chat={chat}/>: ""}
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
