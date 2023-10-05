import React, { useState, useEffect } from "react";
import { ChatChannels } from "../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  removeOpenedChatChannel,
  setChatClose,
  setChatOpen,
  resetNotification,
} from "../../redux/sessionSlice";
import Chat from "./Chat";
import { getName } from "./functions.ts";
import "./ChatBox.scss";
import { AiFillSetting } from "react-icons/ai";
import PopupManagement from "./PopupChatManagement/PopupManagement.tsx"


const ChatBoxes = () => {
  const currentUser = useAppSelector((state) => state.session.user);
  const openedChannels = useAppSelector(
    (state) => state.session.OpenedChatChannels,
  );
  const dispatch = useAppDispatch();
  const [minimizedChat, setMinimizedChat] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<ChatChannels | undefined>(undefined);

  const handleToggleChatClose = (chat: ChatChannels) => {
    dispatch(setChatClose(chat));
    dispatch(removeOpenedChatChannel(chat.id));
  };

  const handleMinimize = (chat: ChatChannels) => {
    if (minimizedChat?.includes(chat.id)) {
      setMinimizedChat(minimizedChat.filter((id) => id !== chat.id));
      dispatch(setChatOpen(chat));
      dispatch(resetNotification(chat));
      if (chat.messages?.length > 0){
        dispatch({
          type: "MSG_READ",
          payload: [chat.messages[chat.messages.length - 1].id, currentUser?.id]
        });
      }
    } else {
      setMinimizedChat([...minimizedChat, chat.id]);
      dispatch(setChatClose(chat));
    }
  };

  const box = (chat: ChatChannels) => {
    return (
      <div
        className={`inner-chat-boxes-wrapper ${
          minimizedChat.includes(chat.id) ? "minimized" : ""
        }`}
      >
        <div className="chat-name-wrapper">
          <div className="chat-name">
            {getName(chat, currentUser!)}
          </div>
          <div className="chat-name-wrapper-right">
            <button
              className="chat-box-button"
              onClick={() => handleMinimize(chat)}
            >
              {minimizedChat.includes(chat.id) ? "+" : "-"}
            </button>
            <div className="chat-box-button" onClick={()=> {
              setIsOpen(true);
              setSelectedChat(chat);}}>
              <AiFillSetting />
            </div>
            <img
              onClick={() => handleToggleChatClose(chat)}
              src={"/cross.svg"}
              alt="Close"
              className="chat-box-button"
            />
          </div>
        </div>
        {!minimizedChat.includes(chat.id) && <Chat chatId={chat.id} />}
      </div>
    );
  };

  return (
    <>
      <div className="chat-boxes-wrapper">
        {openedChannels?.map((chat) => (
          <div
            key={chat.id}
            className={`chat-box ${
              minimizedChat.includes(chat.id) ? "minimized" : ""
            }`}
          >
            {box(chat)}
          </div>
        ))}
      </div>
      <PopupManagement chat={selectedChat} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default ChatBoxes;
