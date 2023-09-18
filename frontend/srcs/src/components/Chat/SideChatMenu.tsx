import React, { useState, useEffect } from "react";
import { ChatChannels } from "../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  addOpenedChatChannel,
  setChatOpen,
  resetNotification,
} from "../../redux/sessionSlice";
import { VscFoldDown, VscFoldUp } from "react-icons/vsc";
import "./SideChatMenu.scss";
import { getName } from "./functions.ts";
import ChatBoxes from "./ChatBox.tsx";
import "./ChatBox.scss"
import ChatCreator from "./ChatCreator.tsx";

const SideChatMenu = () => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const storedJoinedChannels: ChatChannels[] | undefined = useAppSelector(
    (state) => state.session.JoinedChatChannels,
  );
  const openedChannels = useAppSelector(
    (state) => state.session.OpenedChatChannels,
  );
  const [chatBox, setChatBox] = useState<ChatChannels | null>(null);
  const [showChatCreator, setShowChatCreator] = useState(false)
  const [menuCss, setMenuCss] = useState("open-chat-menu");
  const [minimizedList, setMinimizedList] = useState<string[] | undefined>([]);
  // ================================================================== //
  const userName = currentUser?.username;
  // La variable au dessus est dangereuse
  // ================================================================== //
  const toggleMenu = () => {
    setMenuCss((prevCss) =>
      prevCss.startsWith("open")
        ? "close-chat-menu chat-menu-transition-close"
        : "open-chat-menu chat-menu-transition-open",
    );
  };
  const generalChannels: ChatChannels[] | undefined =
    storedJoinedChannels?.filter((chat) => chat.channelType === "general");
  const privateChannels: ChatChannels[] | undefined =
    storedJoinedChannels?.filter((chat) => chat.channelType === "private");
  const joinedGroupChannels: ChatChannels[] | undefined =
    storedJoinedChannels?.filter((chat) => chat.channelType === "created");

  const handleChatTypeListClick = (_type: string) => {
    if (minimizedList?.includes(_type)) {
      setMinimizedList(minimizedList.filter((item) => item !== _type));
    } else if (minimizedList !== undefined) {
      setMinimizedList([...minimizedList, _type]);
    } else {
      setMinimizedList([_type]);
    }
  };

  const handleChatBoxClick = (chat: ChatChannels) => {
    if (
      !openedChannels?.some((channel: ChatChannels) => channel.id === chat.id)
    ) {
      dispatch(addOpenedChatChannel(chat));
      dispatch(setChatOpen(chat));
      dispatch(resetNotification(chat));
      dispatch({
        type: "MSG_READ",
        payload: chat.messages[chat.messages.length - 1],
      });
    }
  };




  const channelsList = (channels: ChatChannels[]) => {
    return (
      <div>
        {channels.map((chat: ChatChannels) => (
          <li
            className={`chat-item${chatBox === chat ? "-active" : ""}`}
            key={chat.id}
            onClick={() => handleChatBoxClick(chat)}
          >
            <div
              className={`notification${
                chat.notifications > 0 ? "-some" : "-none"
              }`}
            >
              {chat.notifications ? `${chat.notifications}` : ""}
            </div>
            <div className="chat-name-in-menu">{getName(chat, userName)}</div>
          </li>
        ))}{" "}
      </div>
    );
  };

  const channelsTypeList = ( list: ChatChannels[] | undefined, _type: string) => {
    if (list !== undefined && list.length > 0) {
      return (
        <ul className="inner-chat-list-wrapper">
          <div
            className="channel-type-wrapper"
            onClick={() => handleChatTypeListClick(_type)}
          >
            <div className="channel-type-name"> {`${_type}`} </div>
            <div>
              {minimizedList?.includes(_type) ? (
                <VscFoldUp />
              ) : (
                <VscFoldDown />
              )}
            </div>
          </div>
          <div>
            {minimizedList?.includes(_type)
              ? ""
              : channelsList(list)}
          </div>
        </ul>
      );
    }
  };
  
  const displayList = () => {
    return (
      <div>
        {channelsTypeList(privateChannels, "private")}
        {channelsTypeList(generalChannels, "general")}
        {channelsTypeList(joinedGroupChannels, "general")}
      </div>
    );
  };


  return (
    <div className={`chat-menu-wrapper ${menuCss}`}>
      <ChatBoxes />
      <img
        className={`logo-nav chat-menu-icon`}
        src={"/comments.svg"}
        alt="Chat Menu"
        onClick={toggleMenu}
      />
      <button id="chat" onClick={()=> setShowChatCreator(!showChatCreator)}>
        Channel Creator
      </button>
        {  showChatCreator ?  <ChatCreator /> : ""}
      <div className="inner-chat-menu-wrapper">{displayList()}</div>
    </div>
  );
};
export default SideChatMenu;
