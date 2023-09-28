import { Popup } from 'reactjs-popup';
import { ChatChannels } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import UserListItem from "./userItemManagement.tsx";
import ChatSettings from "./chatSettings.tsx";
import React, { useState, useEffect } from 'react';
import LeaveChatButton from "./leaveChatButton.tsx";
import AddParticipants from "./addParticipants.tsx";
import BanUserItem from "./banUsersItem.tsx";
import { WhatsMyId, WhatsMyName } from "./addParticipantsSearchBar.tsx";
import ModifyChatForm from "./modifyChatForm.tsx";

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
  const [listTodisplay, setListToDisplay] = useState<string>("participants");
  const currentRelations = useAppSelector(
    (state) => state.session.friendships)?.filter(
      (relations) => relations.status === 'BLOCKED');

  useEffect(() => {
    if (!currentOpenedChat?.participants?.filter((user) => user.id === currentUser?.id).length)
      setIsOpen(false);
  }, [currentOpenedChat]);

  const display = () => {
    if (listTodisplay === "participants")
      return (currentOpenedChat?.participants?.map((user)=>{
        if (currentUser?.id !== user?.id && currentRelations?.filter((relation) => {
          if (WhatsMyId(currentUser!, relation) === user.id){
            return relation;
          }
        }).length === 0){
            return (<UserListItem 
              key={user.id} 
              user={user} 
              chat={currentOpenedChat} 
              setIsOpen={setIsOpen} />);
        }
          return null;
      }))
    else if (listTodisplay === "banned")
      return (currentOpenedChat?.bannedUsers?.map((userban)=>{
            if (!currentRelations?.filter((relation) => {
              if (WhatsMyId(currentUser!, relation) === userban.id) {
                return relation;
              }
            }).length)
              return (<BanUserItem key={userban.id} user={userban} chat={currentOpenedChat} />);
      }));
    else if (listTodisplay === "modify")
      return (<ModifyChatForm chat={chat}/>);
  }

  return (
    <Popup
        open={isOpen}
        closeOnDocumentClick={false}
        onClose={() => setIsOpen(false)}
        {...{ contentStyle, arrowStyle }}
    >
      <div className='popup-close-container'>
        <button className='close-popup' onClick={() =>{setIsOpen(false)}}>x</button>
        <div className='chat-popup'>
          <div className='popup-top'>
            <div className='popup-chat-menu'>

              {chat?.owner.id === currentUser?.id ? <button onClick={ () => setListToDisplay("modify")}>{"MODIFY"}</button> : ""}
              <button onClick={ () => setListToDisplay("participants")}>{"ALL USERS"}</button>
              <button onClick={ () => setListToDisplay("banned")}>{"BANNED USERS"}</button>
            </div>
            {listTodisplay === "participants" ? <AddParticipants chat={currentOpenedChat!} /> : ""}
          </div>
          <ul>
            {display()}
          </ul>
        </div>
        <div className="popup-leave-currentOpenedChat-button">
          <LeaveChatButton chat={currentOpenedChat!} setIsOpen={setIsOpen} />
        </div>
    </div>
    </Popup>
  );
};
export default PopupManagement;
