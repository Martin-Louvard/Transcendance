import { ChatChannels } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import React, { useState, useEffect, KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import {IoMdPersonAdd} from "react-icons/io";

const AddParticipantsSearchBar = ({chat} : {chat: ChatChannels}) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const [searchInput, setSearchInput] = useState<string>("");
  const currentRelations = useAppSelector(
    (state) => state.session.friendships)?.filter(
      (relations) => relations.status === 'ACCEPTED');
  const currentFriends = useAppSelector(
    (state) => state.session.friends)?.filter(
      (friend) => {
        if (currentRelations 
          && currentRelations.filter(
            (relation) => relation.friend_id === friend.id).length > 0){
          return friend;
        }
      });
  const dispatch = useAppDispatch();
  

  const handleSearch = () => {
    if (currentFriends && currentFriends?.filter(
      (friend) => friend.username === searchInput).length > 0){
      const friend = currentFriends.filter(
        (friend) => friend.username === searchInput)[0];
      dispatch({type: 'ADD_USER_CHAT', payload:[chat.id, friend.id]})
      toast.success(`${friend.username} has been add to the chat`);
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
      <div className="popup-button-add-people" 
        onClick={() => handleSearch()}>{"ADD PEOPLE"}<IoMdPersonAdd /></div>
    </div>
  );
};

export default AddParticipantsSearchBar;
