import React from 'react';
import './Dashboard.scss';
import { Lobby } from '../Game/Lobby/Lobby';
import {useAppSelector } from '../../redux/hooks';
import SideChatMenu from '../Chat/SideChatMenu';
import ProfileCard from '../UserProfileCards/ProfileCard';
import FriendsListCard from '../UserProfileCards/FriendsListCard';
import HistoryCard from '../UserProfileCards/HistoryCard';
import {ContentOptions } from '../../Types';
import FriendCard from '../UserProfileCards/FriendCard.tsx';
import Leaderboard from '../Leaderboard/Leaderboard.tsx';
import ChangeInfo from '../Forms/UpdateUserInfoForm.tsx';
import TwoFACard from '../2FA/2FACard.tsx';

const Dashboard: React.FC = () => {
  const contentToShow = useAppSelector((state) => state.session.contentToShow);
  // const friendProfile = useAppSelector((state) => state.session.friendProfile);
  const user = useAppSelector((state) => state.session.user);

  const renderContent = () => {
    // if (contentToShow === ContentOptions.PROFILE) return <ProfileCard/>;
    // if (contentToShow === ContentOptions.FRIENDS) return <FriendsListCard />;
    // if (contentToShow === ContentOptions.LEADERBOARD) return <Leaderboard />;
    // if (contentToShow === ContentOptions.PLAY) return <Lobby />;
    // if (contentToShow === ContentOptions.FRIENDPROFILE && friendProfile)  return <FriendCard userToDisplay={friendProfile}/>;
    // if (contentToShow === ContentOptions.CHANGEINFO) return <ChangeInfo />;
    // if (user && contentToShow === ContentOptions.HISTORY) return <HistoryCard user={user}/>;
    // if (user && contentToShow === ContentOptions.TWOFA) return <TwoFACard/>;
  };
     
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
