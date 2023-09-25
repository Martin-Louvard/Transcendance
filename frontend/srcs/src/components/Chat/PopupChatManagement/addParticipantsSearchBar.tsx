import { ChatChannels } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import React, { useState, useEffect } from 'react';

const AddParticipantsSearchBar = ({chat} : {chat: ChatChannels}) => {
  const currentUser = useAppSelector((state) => state.session.user);
  return (
    <div className="add-participants-search-bar-wrapper">

    </div>
  );
};

export default AddParticipantsSearchBar;
