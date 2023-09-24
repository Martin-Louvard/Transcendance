import React, { useRef, useEffect } from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss';
import { Lobby } from '../Game/Lobby/Lobby';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import SideChatMenu from '../Chat/SideChatMenu';
import { useState } from 'react';
import ProfileCard from '../UserProfileCards/ProfileCard';
import FriendsListCard from '../UserProfileCards/FriendsListCard';
import HistoryCard from '../UserProfileCards/HistoryCard';
import ChatCreator from '../Chat/ChatCreator';
import { setContentToShow } from '/src/redux/websocketSlice';

const Dashboard: React.FC = () => {
  const contentToShow = useAppSelector((state) => state.websocket.contentToShow);
  const dispatch = useAppDispatch();
  //const [contentToShow, setContentToShow] = useState< "profile" | "friends" | "games" | "friendUser"| "lobby"  >("lobby");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLImageElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.id;
    if (targetId === "profile") dispatch(setContentToShow("profile"));
    else if (targetId === "friends") dispatch(setContentToShow("friends"));
    else if (targetId === "history") dispatch(setContentToShow("games"));
    else if (targetId === "play") dispatch(setContentToShow("lobby"));
  };

  const renderContent = () => {

    if (contentToShow === "profile") return <ProfileCard />;
    if (contentToShow === "friends") return <FriendsListCard />;
    if (contentToShow === "games") return <HistoryCard />;
    if (contentToShow === "lobby") return <Lobby />;

  };

  const renderMenuButtons = () => (
    <div className='menu-bottom'>
      <button id="friends" onClick={handleClick}>
        Friends
      </button>
      <button id="history" onClick={handleClick}>
        LeaderBoard
      </button>
      <button id="profile" onClick={handleClick}>
        My Profile
      </button>
      <button id="play" onClick={handleClick}>
        Play
      </button>
    </div>
  );


     
  return (
    <div className="dashboard-wrapper">
      {renderMenuButtons()}
      <SideChatMenu />
      <div className="canvas-wrapper">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
