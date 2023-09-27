import React, { useState, KeyboardEvent } from "react";
import { ChatChannels } from "../../Types.ts";
import { BsFillPersonFill, BsSearch } from "react-icons/bs";
import { getName } from "./functions.ts";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import "./SideChatMenu.scss";
import {
  addOpenedChatChannel,
  setChatOpen,
  resetNotification,
  addNewChatChannel,
} from "../../redux/sessionSlice";
import { Popup } from 'reactjs-popup';
import "reactjs-popup/dist/index.css";
import toast from 'react-hot-toast';


interface searchBarChatProps {
  fetchedChannels: ChatChannels[] | undefined;
}
let contentStyle = { background: 'transparent', border: "none"};
const SearchBarChat: React.FC<searchBarChatProps> = ({ fetchedChannels }) => {

  const currentUser = useAppSelector((state) => state.session.user);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<ChatChannels[] | undefined>([]);
  const [chatBox, setChatBox] = useState<ChatChannels | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatChannels | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (fetchedChannels && currentUser){
      const foundChannels: ChatChannels[] | undefined = fetchedChannels.filter((chan) => {
        if (getName(chan, currentUser.username).toLowerCase().includes(searchTerm.toLowerCase()) 
          && (chan.channelType !== "Private" && !chan.participants.includes(currentUser)
            && !chan.bannedUsers.filter((user) => user.id === currentUser?.id).length)){
          return chan;
        }
      });
      setSearchResult(foundChannels);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSearch();
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
        if (chat.channelType !== "Password"){
          dispatch({
            type: "JOIN_CHAT",
            payload: [currentUser.id, chat.id],
          });
          dispatch(addOpenedChatChannel(chat));
          dispatch(setChatOpen(chat));
        }
        else {
          setSelectedChat(chat);
        }
      }
    }
  }

  const  checkPassword = async () =>{


  const requestOptions = {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: passwordInput,
     })
  };
  try{
    const response =  await fetch(`http://localhost:3001/chat-channels/${selectedChat?.id}`, requestOptions)
    if (response.ok)
    {
      const data = await response.json();
      return(data);
    }
  }catch(err) {
    console.log(err);
  }
}

  const handleJoinWithPasswd = async () => {

    if (currentUser && selectedChat) {
      const passwordValid = await checkPassword()
      if (passwordValid){
        dispatch({
          type: "JOIN_CHAT",
          payload: [currentUser.id, selectedChat.id],
        });
        dispatch(addOpenedChatChannel(selectedChat));
        dispatch(setChatOpen(selectedChat));
        setSelectedChat(null);
        setPasswordInput("");
      }
      else {
        toast.error("Invalid password");
      }
    }
  };

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
              <div className="chat-participants">
                <div>{`${chat.participants.length}`}</div>
                <div>
                  <BsFillPersonFill />
                </div>
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
          onKeyDown={handleKeyDown}
        />
        <div onClick={handleSearch}>
          <BsSearch />
        </div>
      </div>
      <div>{searchResult ? resultList(searchResult) : ""}</div>
      <Popup
        open={!!selectedChat}
        closeOnDocumentClick={true}
        onClose={() => setSelectedChat(null)}
        {...{contentStyle}}
      >
        <div className="chat-popup popup-mdp">
          <h2>Enter password to join</h2>
          <input
            type="password"
            placeholder="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <div className="modal-buttons">
            <button onClick={() => setSelectedChat(null)}>cancel</button>
            <button onClick={handleJoinWithPasswd}>join</button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default SearchBarChat;
