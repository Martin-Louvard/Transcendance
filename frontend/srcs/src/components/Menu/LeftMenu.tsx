import React, { useEffect, useState } from 'react';
import ProfileCard from '../UserProfileCards/ProfileCard';
import FriendsListCard from '../UserProfileCards/FriendsListCard';
import HistoryCard from '../UserProfileCards/HistoryCard';
import './LeftMenu.scss';
import { useAppSelector } from '../../redux/hooks';
import { Status } from '../../Types';
import { useAppDispatch } from '../../redux/hooks';

const LeftMenu = () => {
  const user = useAppSelector((state) => state.session.user)
  const [fullscreen, setFullScreen] = useState(false);
  const [menuCss, setMenuCss] = useState("open-menu");
  const [contentToShow, setContentToShow] = useState("menu");
  const friendships = useAppSelector((state)=> state.session.friendships)
  const [friendRequests, setFriendRequest] = useState(friendships)
  const dispatch = useAppDispatch();

  useEffect(()=>{
    if (friendships){
      setFriendRequest(friendships.filter(f => (f.status === Status.PENDING && f.user_id != user?.id)))
    }
  }, [friendships])

  const toggleMenu = () => {
    setMenuCss((prevCss) =>
      prevCss.startsWith("open") ? "close-menu menu-transition-close" : "open-menu menu-transition-open"
    );
    setFullScreen((prevFullscreen) => !prevFullscreen);
  };

  const handleClick = (event: React.MouseEvent<any>) => {
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

  const renderNotifications = () => (   
     <>
    <h2>Friend Requests</h2>
        <ul className="friend-list">
          {friendRequests ? friendRequests.map((friendship, index) => (
            <li className="friend-item" key={index}>
            <div className='friend-picture'>
              <img src={friendship.friend_id == user?.id ? friendship.user.avatar:friendship.friend.avatar}/>
            </div>
              <p>{friendship.friend_id == user?.id ? friendship.user.username:friendship.friend.username}</p>
              <button onClick={()=>{ dispatch({ type: 'WEBSOCKET_UPDATE_FRIEND_REQUEST', payload: [friendship.id, friendship.friend_id == user?.id ? friendship.user.id:friendship.friend.id, Status.ACCEPTED] }) }}>✅</button>
              <button onClick={()=>{ dispatch({ type: 'WEBSOCKET_UPDATE_FRIEND_REQUEST', payload: [friendship.id, friendship.friend_id == user?.id ? friendship.user.id:friendship.friend.id, Status.DECLINED] }) }}>❌</button>
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
