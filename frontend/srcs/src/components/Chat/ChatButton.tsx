import React, { useState, useEffect } from "react";
import  ChatChannels  from '../../Types';
import { useAppSelector } from "../../hooks";
import io, { Socket } from "socket.io-client";
import { setUser } from '../Authentication/userReducer.ts';

const ChatButton = () => {

  const currentUser = useAppSelector((state)=>state.user);

  return (
  <>
    <li>
    </li>
  </>
)
}

export default ChatButton;
