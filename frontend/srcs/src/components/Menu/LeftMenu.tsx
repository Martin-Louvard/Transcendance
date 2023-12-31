import React, { useEffect, useState } from 'react';
import ProfileCard from '../UserProfileCards/ProfileCard';
import FriendsListCard from '../UserProfileCards/FriendsListCard';
import HistoryCard from '../UserProfileCards/HistoryCard';
import ChatCreator from '../Chat/ChatCreator';
import './LeftMenu.scss';
import '../UserProfileCards/Cards.scss'
import { useAppSelector } from '../../redux/hooks';
import { Status } from '../../Types';
import { useAppDispatch } from '../../redux/hooks';
import { Friendships } from '../../Types';
import FriendCard from '../UserProfileCards/FriendCard';
import { deleteInvitedGame, setLobbyType, setParams } from '../../redux/websocketSlice';
import { ClientEvents, ClientPayloads, GameRequest, LobbyMode, LobbyType } from '@shared/class';

const LeftMenu: React.FC = () => {
  const user = useAppSelector((state) => state.session.user)
  const [fullscreen, setFullScreen] = useState(false);
  const [menuCss, setMenuCss] = useState("open-menu");
  const [contentToShow, setContentToShow] = useState<"menu" | "profile" | "friends" | "games" | "friendUser"| "chat">("menu");
  const friendships = useAppSelector((state)=> state.session.friendships)
  const [friendRequests, setFriendRequest] = useState<Friendships[] | undefined>(friendships)
  const [selectedFriendship, setSelectedFriendship] = useState(Object)
  const gameRequest = useAppSelector((state) => state.websocket.invitedGames);
  const dispatch = useAppDispatch();
  const game = useAppSelector((state) => state.websocket)

  useEffect(()=>{
    if (friendships){
      let friendshipstmp: Friendships[] = [];
      friendships.forEach((e) => {
        if (e.status === Status.PENDING && e.sender_id != user?.id)
          friendshipstmp.push(e);
      })
      setFriendRequest(friendshipstmp);
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
    else if (targetId === "chat") setContentToShow("chat");
    else if (targetId === "back") setContentToShow("menu");    
  };

  const renderContent = () => {
    if (fullscreen) return null;

    if (contentToShow === "profile") return <ProfileCard />;
    if (contentToShow === "friends") return <FriendsListCard setContentToShow={setContentToShow}/>;
    if (contentToShow === "games") return <HistoryCard />;
    if (contentToShow === "chat") return <ChatCreator />;
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
      <button id="chat" onClick={handleClick}>
        Chats
      </button>
      <button id="profile" onClick={handleClick}>
        My Profile
      </button>
      {friendRequests && friendRequests.length > 0 ? renderNotifications() : ""}
      {renderGameNotifcation()}
    </>
  );

  const renderNotifications = () => (   
  <div className="friends-card-wrapper">
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
                <button onClick={()=>{ dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [friendship.id, friendship.friend_id == user?.id  ? friendship.user.username:friendship.friend.username, Status.ACCEPTED] }) }}>Add Friend ✅</button>
                <button onClick={()=>{ dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [friendship.id,friendship.friend_id == user?.id  ? friendship.user.username:friendship.friend.username, Status.DECLINED] }) }}>Decline ❌</button>
              </div>
            </div>
            </li>
          )) : <></>}
        </ul>
    </div>
  )
  function joinLobby(request: GameRequest) {
    dispatch(setLobbyType(LobbyType.create));
    dispatch({
      type: "WEBSOCKET_SEND_JOIN_LOBBY",
      payload: {lobbyId: request.lobby.id, info: {username: user?.username, avatar: user?.avatar, id: user?.id}},
    })
    dispatch({
      type: "WEBSOCKET_SEND_DELETE_GAME_INVITATION",
      payload: request,
    })
    if (!request.lobby.params)
      return ;
    dispatch(setParams(request.lobby.params));
  }

  const renderGameNotifcation = () => (
    
    <div className="friends-card-wrapper">
      <h2>Game Requests</h2>
          <ul className="friend-list">
            {gameRequest ? gameRequest.map((request, index, requests) => (
              <li className="friend-item" key={index}>
              <div className='friend-picture'>
                <img src={request.sender.avatar}/>
              </div>
              <div>
                <p>{request.sender.username}</p>
                <div className='accept-deny'>
                  <button onClick={() => {joinLobby(request);dispatch(deleteInvitedGame(request))}} >Join Game ✅</button>
                  <button onClick={() => {dispatch(deleteInvitedGame(request));     dispatch({
                    type: "WEBSOCKET_SEND_DELETE_GAME_INVITATION",
                    payload: request,
                  })}}>Decline ❌</button>
                </div>
              </div>
              </li>
            )) : <></>}
          </ul>
      </div>
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
