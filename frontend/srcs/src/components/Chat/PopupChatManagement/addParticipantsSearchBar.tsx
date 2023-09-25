import { ChatChannels, User, Friendships } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import React, { useState, useEffect, KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import {IoMdPersonAdd} from "react-icons/io";

function  WhatsMyName(currentUser: User, friendShip: Friendships) {
  if (currentUser.id === friendShip.friend_id) {
    return (friendShip.user.username);
  }
  else {
    return (friendShip.friend.username);
  }
}

function  WhatsMyId(currentUser: User, friendShip: Friendships) {
  if (currentUser.id === friendShip.friend_id) {
    return (friendShip.user.id);
  }
  else {
    return (friendShip.friend.id);
  }
}

const AddParticipantsSearchBar = ({chat} : {chat: ChatChannels}) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const [searchInput, setSearchInput] = useState<string>("");
  const currentRelations = useAppSelector(
    (state) => state.session.friendships)?.filter(
      (relations) => relations.status === 'ACCEPTED');
  const dispatch = useAppDispatch();
  

  const handleSearch = () => {
    if (currentRelations && currentRelations?.filter(
      (friend) => WhatsMyName(currentUser!, friend) === searchInput).length > 0){
      const friend = currentRelations.filter(
        (friend) => WhatsMyName(currentUser!, friend) === searchInput)[0];
      dispatch({type: 'ADD_USER_CHAT', payload:[chat.id, WhatsMyId(currentUser!, friend)]})
      toast.success(`${WhatsMyName(currentUser!, friend)} has been add to the chat`);
    }
    else {
      toast.error("User not found");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className="add-participants-search-bar-wrapper">
      <input
        type="text"
        placeholder="add..."
        value={searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} />
      <div className="popup-button-add-people" onClick={() => handleSearch()}>
          <div>ADD PEOPLE</div>
          <IoMdPersonAdd />
      </div>
    </div>
  );
};

export default AddParticipantsSearchBar;
