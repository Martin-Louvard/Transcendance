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
import { Friendships, Status, ContentOptions } from '../../Types';
import Notification from '../UserProfileCards/Notification.tsx';
import { setContentToShow } from '../../redux/sessionSlice.ts';
import FriendCard from '../UserProfileCards/FriendCard.tsx';

const Dashboard: React.FC = () => {
  const contentToShow = useAppSelector((state) => state.session.contentToShow);
  const friendProfile = useAppSelector((state) => state.session.friendProfile);
  const user = useAppSelector((state) => state.session.user);
  const friendships = useAppSelector((state) => state.session.friendships);
  const [friendRequests, setFriendRequest] = useState<Friendships[] | undefined>(friendships);
  const dispatch = useAppDispatch();

  useEffect(()=>{
    if (friendships){
      setFriendRequest(friendships.filter(f => (f.status === Status.PENDING && f.sender_id != user?.id)))
    }
  },[friendships])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLImageElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.id;
    if (targetId === "profile") dispatch(setContentToShow(ContentOptions.PROFILE));
    else if (targetId === "friends") dispatch(setContentToShow(ContentOptions.FRIENDS));
    else if (targetId === "history") dispatch(setContentToShow(ContentOptions.HISTORY));
    else if (targetId === "play") dispatch(setContentToShow(ContentOptions.PLAY));
  };

  const renderContent = () => {
    if (contentToShow === ContentOptions.PROFILE) return <ProfileCard/>;
    if (contentToShow === ContentOptions.FRIENDS) return <FriendsListCard />;
    if (contentToShow === ContentOptions.HISTORY) return <HistoryCard />;
    if (contentToShow === ContentOptions.PLAY) return <Lobby />;
    if (contentToShow === ContentOptions.FRIENDPROFILE && friendProfile)  return <FriendCard userToDisplay={friendProfile}/>;
  };

  const renderMenuButtons = () => (
    <div className='menu-bottom'>
      
      <button id="friends" onClick={handleClick}>
        Friends
        <Notification number={friendRequests?.length}/>
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
      <SideChatMenu />
      <div className="canvas-wrapper">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
