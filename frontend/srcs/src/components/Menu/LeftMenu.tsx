import React, { useEffect, useState } from 'react';
import ProfileCard from '../UserProfileCards/ProfileCard';
import FriendsListCard from '../UserProfileCards/FriendsListCard';
import HistoryCard from '../UserProfileCards/HistoryCard';
import './LeftMenu.scss';
import '../UserProfileCards/Cards.scss'
import { useAppSelector } from '../../redux/hooks';
import { Status } from '../../Types';
import { useAppDispatch } from '../../redux/hooks';
import { Friendships } from '../../Types';
import FriendCard from '../UserProfileCards/FriendCard';

const LeftMenu: React.FC = () => {
  const user = useAppSelector((state) => state.session.user)
  const [fullscreen, setFullScreen] = useState(false);
  const [menuCss, setMenuCss] = useState("open-menu");
  const [contentToShow, setContentToShow] = useState<"menu" | "profile" | "friends" | "games" | "friendUser">("menu");
  const friendships = useAppSelector((state)=> state.session.friendships)
  const [friendRequests, setFriendRequest] = useState<Friendships[] | null>(friendships)
  const [selectedFriendship, setSelectedFriendship] = useState(Object)
  const dispatch = useAppDispatch();

  useEffect(()=>{
    if (friendships){
      setFriendRequest(friendships.filter(f => (f.status === Status.PENDING && f.sender_id != user?.id)))
    }
  }, [friendships])

  const toggleMenu = () => {
    setMenuCss((prevCss) =>
      prevCss.startsWith("open") ? "close-menu menu-transition-close" : "open-menu menu-transition-open"
    );
    setFullScreen((prevFullscreen) => !prevFullscreen);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLImageElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.id;
    if (targetId === "profile") setContentToShow("profile");
    else if (targetId === "friends") setContentToShow("friends");
    else if (targetId === "history") setContentToShow("games");
    else if (targetId === "back") setContentToShow("menu");
  };

  const renderContent = () => {
    if (fullscreen) return null;

    if (contentToShow === "profile") return <ProfileCard />;
    if (contentToShow === "friends") return <FriendsListCard />;
    if (contentToShow === "games") return <HistoryCard />;
    if (contentToShow === "friendUser") return <FriendCard friendship={selectedFriendship}/>;
    return renderMenuButtons();
  };

  const renderMenuButtons = () => (
    <>
      <button id="friends" onClick={handleClick}>
        Friends
      </button>
      <button id="history" onClick={handleClick}>
        LeaderBoard
      </button>
      <button id="profile" onClick={handleClick}>
        My Profile
      </button>
      {friendRequests ? renderNotifications() : ""}
    </>
  );

// Rajourter une variable initiated by dans le modele friends pour gerer le passage d'une declined en pending
  const renderNotifications = () => (   
     <>
    <h2>Friend Requests</h2>
        <ul className="friend-list">
          {friendRequests ? friendRequests.map((friendship, index) => (
            <li className="friend-item" key={index}>
            <div className='friend-picture' onClick={()=>{setSelectedFriendship(friendship); setContentToShow("friendUser") }}>
              <img src={friendship.friend_id == user?.id ? friendship.user.avatar: friendship.friend.avatar}/>
            </div>
            <div>
              <p>{friendship.friend_id == user?.id ? friendship.user.username:friendship.friend.username}</p>
              <div className='accept-deny'>
                <button onClick={()=>{ dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [friendship.id, friendship.sender_id !== user?.id ? friendship.user.username:friendship.friend.username, Status.ACCEPTED] }) }}>Add Friend ✅</button>
                <button onClick={()=>{ dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [friendship.id, friendship.sender_id !== user?.id ? friendship.user.username:friendship.friend.username, Status.DECLINED] }) }}>Decline ❌</button>
              </div>
            </div>
            </li>
          )) : <></>}
        </ul>
    </>
  )

  return (
    <>
      <div className={`menu-wrapper ${menuCss}`}>
        {(contentToShow !== "menu" || fullscreen) && (
          <img
            id="back"
            onClick={handleClick}
            className="exit-button"
            src={'cross.svg'}
            alt="Close"
          />
        )}
        <img
          className={`logo-nav menu-icon`}
          src={'/menu.svg'}
          alt="Menu"
          onClick={toggleMenu}
        />
        <div className="inner-menu-wrapper">{renderContent()}</div>
      </div>
    </>
  );
};

export default LeftMenu;
