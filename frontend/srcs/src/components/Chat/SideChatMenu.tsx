import React, { useState, useEffect } from "react";
import { ChatChannels } from "../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  addOpenedChatChannel,
  setChatOpen,
  resetNotification,
} from "../../redux/sessionSlice";
import { VscTriangleDown, VscTriangleLeft } from "react-icons/vsc";
import { IoIosChatboxes } from "react-icons/io";
import "./SideChatMenu.scss";
import { getName } from "./functions.ts";
import { TbMessagePlus } from "react-icons/tb";
import ChatCreator from "./ChatCreator.tsx";
import SearchBarChat from "./SearchChat.tsx";
import { BsFillPersonFill, BsSearch } from "react-icons/bs";
import { fetchChatChannelsApi } from "../../api.ts"
import ChatBoxes from "./ChatBox.tsx";

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
  const [isChatList, setIsChatList] = useState<boolean>(true);
  const [searchList, setSearchList] = useState<ChatChannels[] | undefined>([]);
  const userName = currentUser?.username;
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
    storedJoinedChannels?.filter((chat) => chat.channelType === "Private");
  const joinedGroupChannels: ChatChannels[] | undefined =
    storedJoinedChannels?.filter((chat) => {
      if (chat.channelType === "created" || chat.channelType === "Password")
        return chat;
    });
  const publicChannels: ChatChannels[] | undefined =
    storedJoinedChannels?.filter((chat) => chat.channelType === "public");
  const [chatMenuChoice, setChatMenuChoice] = useState<string>("chatList");


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
      if (chat.messages?.length > 0){
        dispatch({
          type: "MSG_READ",
          payload: [chat.messages[chat.messages.length - 1].id, currentUser?.id]
        });
      }
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
            <div className="chat-name-in-menu">
              <div>{getName(chat, userName)}</div>
              </div>
              <div className="chat-participants">
                <div>{`${chat?.participants?.length}`}</div>
                  <BsFillPersonFill />
              </div>
          </li>
        ))}{" "}
      </div>
    );
  };

  const channelsTypeList = (
    list: ChatChannels[] | undefined,
    _type: string,
  ) => {
    if (list !== undefined && list.length > 0) {
      return (
        <ul className="inner-chat-list-wrapper">
          <div
            className="channel-type-wrapper"
            onClick={() => handleChatTypeListClick(_type)}
          >
            <div className="channel-type-name"> {`${_type}`} </div>
              {minimizedList?.includes(_type) ? <VscTriangleLeft /> : <VscTriangleDown />}
          </div>
          <div>{minimizedList?.includes(_type) ? "" : channelsList(list)}</div>
        </ul>
      );
    }
  };

  const displayList = () => {
    return (
      <div>
        {channelsTypeList(privateChannels, "private")}
        {channelsTypeList(generalChannels, "general")}
        {channelsTypeList(joinedGroupChannels, "created")}
        {channelsTypeList(publicChannels, "public")}
      </div>
    );
  };

  const handleChatListButton = () => {
    if (chatMenuChoice !== "chatList") {
      setChatMenuChoice("chatList");
    }
  };

  const handleCreateChatButton = () => {
    if (chatMenuChoice !== "createChat") {
      setChatMenuChoice("createChat");
    }
  };

  const handleChatSearchButton = async () => {
    if (chatMenuChoice !== "searchChat") {
      setChatMenuChoice("searchChat");
      try {
      const fetchedChannels: ChatChannels[] | undefined = await fetchChatChannelsApi();
        if (fetchedChannels){
          setChatMenuChoice("searchChatWithList");
          setSearchList(fetchedChannels);
        }
      }
      catch (error){
        console.log(error);
      }
    }
  };
	

  const displayChoice = () => {
    if (chatMenuChoice === "chatList")
      return displayList();
    else if (chatMenuChoice === "createChat")
      return (<ChatCreator />); 
    else if (chatMenuChoice === "searchChatWithList")
      return (<SearchBarChat fetchedChannels={searchList}/>); 
    else
      return ;
  };

  return (
    <div className={`chat-menu-wrapper ${menuCss}`}>
      <ChatBoxes />
      <img
        className={`logo-nav chat-menu-icon`}
        src={"/chat-icon.svg"}
        alt="Chat Menu"
        onClick={toggleMenu}
      />
      <div className="inner-chat-menu-wrapper">
        <div className="chat-menu-header">
          <div onClick={handleChatListButton} className="chat-list-button">
            <IoIosChatboxes />
          </div>
          <div
            onClick={handleCreateChatButton}
            className="create-new-chat-button"
          >
            <TbMessagePlus />
          </div>
          <div className="search-button" onClick={handleChatSearchButton}>
            <BsSearch />
          </div>
        </div>
        <div>{displayChoice()}</div>
      </div>
    </div>
  );
};
export default SideChatMenu;
