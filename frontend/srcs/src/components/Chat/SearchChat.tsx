import React, { useState } from "react";
import { ChatChannels } from "../../Types.ts";
import { BsFillPersonFill, BsSearch } from "react-icons/bs";
import { getName } from "./functions.ts";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import "./SideChatMenu.scss";
import {
  addOpenedChatChannel,
  setChatOpen,
  resetNotification,
  updateChat,
} from "../../redux/sessionSlice";

interface searchBarChatProps {
  fetchedChannels: ChatChannels[] | undefined;
}

const SearchBarChat: React.FC<searchBarChatProps> = ({ fetchedChannels }) => {

  const currentUser = useAppSelector((state) => state.session.user);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<ChatChannels[] | undefined>([]);
  const [chatBox, setChatBox] = useState<ChatChannels | null>(null);
  const dispatch = useAppDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (fetchedChannels && currentUser){
      const foundChannels: ChatChannels[] | undefined = fetchedChannels.filter((chan) => {
        if (getName(chan, currentUser.username).toLowerCase().includes(searchTerm.toLowerCase()) 
          && (chan.channelType !== "private" && !chan.participants.includes(currentUser))){
          return chan;
        }
      });
      setSearchResult(foundChannels);
    }
  };

  const handleSelectedChat = (chat: ChatChannels) => {
    if (currentUser){
      if (chat.participants.includes(currentUser)) {
        dispatch(addOpenedChatChannel(chat));
        dispatch(setChatOpen(chat));
        dispatch(resetNotification(chat));
        if (chat.messages?.length > 0){
          dispatch({
            type: "MSG_READ",
            payload: [chat.messages[chat.messages.length - 1].id, currentUser.id]
          });
        }
      }
      else {
        if (!chat.password){
          dispatch({
            type: "JOIN_CHAT",
            payload: [currentUser.id, chat.id],
          });
          dispatch(addOpenedChatChannel(chat));
          dispatch(setChatOpen(chat));
        }
      }
    }
  }

  const resultList = (channels: ChatChannels[]) => {
    return (
      <div>
        {channels.map((chat: ChatChannels) => (
          <li
            className={`chat-item${chatBox === chat ? "-active" : ""}`}
            key={chat.id}
            onClick={() => handleSelectedChat(chat)}
          >
            <div className="chat-name-in-menu">
              <div>{getName(chat, currentUser?.username)}</div>
              <div>{`${chat.participants.length}`}</div>
              <div>
                <BsFillPersonFill />
              </div>
            </div>
          </li>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="search-chat-input">
        <input
          type="text"
          placeholder="search..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <div onClick={handleSearch}>
          <BsSearch />
        </div>
      </div>
      <div>{searchResult ? resultList(searchResult) : ""}</div>
    </>
  );
};

export default SearchBarChat;
