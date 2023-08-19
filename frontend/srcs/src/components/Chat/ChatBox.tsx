import React, { useState, useEffect } from "react";
import  { ChatChannels }  from '../../Types.ts';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

const ChatBox = () => {
  const currentUser = useAppSelector((state)=>state.session.user);

  return (
    <div>
    </div>
  );
}

export default ChatBox;
