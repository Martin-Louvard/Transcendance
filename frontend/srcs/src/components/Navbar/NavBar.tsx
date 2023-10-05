import React from 'react';
import './NavBar.scss'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { cleanSession } from '../../redux/sessionSlice';
import Notification from '../UserProfileCards/Notification.tsx';
import { setContentToShow } from '../../redux/sessionSlice.ts';
import { Friendships, Status, ContentOptions } from '../../Types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientEvents, ClientPayloads, LobbyType } from '@shared/class.ts';
import { setLobbyType } from '../../redux/websocketSlice.ts';
import { Popup } from 'reactjs-popup';

let contentStyle = { background: 'transparent', border: "none"};
const Navbar: React.FC = () => {
  const logo = '/marvin.png'
  const user = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const friendships = useAppSelector((state) => state.session.friendships);
  const [friendRequests, setFriendRequest] = useState<Friendships[] | undefined>(friendships);
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState("open-menu")
  const gameRequest= useAppSelector((state) => state.websocket.invitedGames)


  useEffect(() =>{
    if (friendships){
      setFriendRequest(friendships.filter(f => (f.status === Status.PENDING && f.sender_id != user?.id)))
    }
  },[friendships])

  const toggleMenu = () => {
    if (isMenuOpen=== "open-menu")
      setIsMenuOpen("close-menu")
    else 
      setIsMenuOpen("open-menu");
  };


  const logout = () =>{
    window.location.href=`http://${import.meta.env.VITE_IP}:3000/`
    dispatch(cleanSession())
    localStorage.removeItem('persist:root')
      const payload: ClientPayloads[ClientEvents.LobbyState] = {
        leaveLobby: true,
        mode: null,
        automatch: null,
        start: false,
      }
      dispatch({
        type: 'WEBSOCKET_SEND_LOBBYSTATE',
        payload: payload,
      });
      dispatch(setLobbyType(LobbyType.none));
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLImageElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.id;
    if (targetId === "profile") navigate("/profile");
    else if (targetId === "friends")navigate("/friends");
    else if (targetId === "leaderboard") navigate("/leaderboard");
    else if (targetId === "play") navigate('/');
  };

  const renderMenuButtons = () => (
    user?.id && user.id != 0 ? 
    <div className={`menu-middle ${isMenuOpen}`}>
      <button id="play" onClick={handleClick}>
        Play
      </button>
      <button id="friends" onClick={handleClick}>
        Friends
        <Notification number={friendRequests ? friendRequests?.length + gameRequest?.length : gameRequest?.length}/>
      </button>
      <button id="profile" onClick={handleClick}>
        My Profile
      </button>
      <button   id="leaderboard" onClick={handleClick}>
        LeaderBoard
      </button>
    </div>
    :""
  );

  return (
    <nav className="navbar">
        <Link  to="/" className="nav-elem-wrapper" onClick={()=>{navigate("/")}}>
          <img src={logo} className="logo-nav" alt="PONGƎD logo" />
          <div className="navbar-brand">PONGƎD</div>
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
            ☰
            </button>
          {renderMenuButtons()}
      <ul className="nav-elem-wrapper">
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            {  user?.id && user.id != 0 ? <button style={{color:'black', backgroundColor:"white"}} className="nav-link" onClick={logout}>Logout</button> : null }
          </li>
        </ul>
        { user?.connections === 0 ?
          <Popup
          open={true}
          closeOnDocumentClick={true}
          {...{contentStyle}}
          >
            <div className="chat-popup popup-onnboarding">
              Please, modify your information in MY Profile tab
            </div>
        </Popup>
      : null}
    </nav>
  );
}

export default Navbar;
