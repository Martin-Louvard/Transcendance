import { ChatChannels } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import React, { useState, useEffect } from 'react';
import AddParticipantsSearchBar from "./addParticipantsSearchBar.tsx";

const AddParticipants = ({chat} : {chat: ChatChannels}) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    if (chat?.admins?.filter((user) => user.id === currentUser?.id).length || chat?.owner?.id === currentUser?.id){
      setIsAllowed(true);
    }
  }, [currentUser, chat]);

  return (
    <div className="popup-add-new-people">
      { isAllowed ? <AddParticipantsSearchBar chat={chat} /> : "" }
    </div>
  );
};
export default AddParticipants;
