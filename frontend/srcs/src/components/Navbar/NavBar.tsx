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

const Navbar: React.FC = () => {
  const logo = '/marvin.png'
  const user = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const friendships = useAppSelector((state) => state.session.friendships);
  const [friendRequests, setFriendRequest] = useState<Friendships[] | undefined>(friendships);
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState("open-menu")
  useEffect(() =>{
    if (friendships){
      setFriendRequest(friendships.filter(f => (f.status === Status.PENDING && f.sender_id != user?.id)))
    }
  },[friendships])

  const toggleMenu = () => {
    console.log(isMenuOpen)
    if (isMenuOpen=== "open-menu")
      setIsMenuOpen("close-menu")
    else 
      setIsMenuOpen("open-menu");
  };


  const logout = () =>{
    window.location.href="http://localhost:3000/"
    dispatch(cleanSession())
    localStorage.removeItem('persist:root')
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLImageElement>) => {
    event.preventDefault();
    navigate('/');
    const targetId = event.currentTarget.id;
    if (targetId === "profile") dispatch(setContentToShow(ContentOptions.PROFILE));
    else if (targetId === "friends") dispatch(setContentToShow(ContentOptions.FRIENDS));
    else if (targetId === "history") dispatch(setContentToShow(ContentOptions.HISTORY));
    else if (targetId === "play") dispatch(setContentToShow(ContentOptions.PLAY));
  };

  const renderMenuButtons = () => (
    user?.id && user.id != 0 ? 
    <div className={`menu-middle ${isMenuOpen}`}>
      <button id="play" onClick={handleClick}>
        Play
      </button>
      <button id="friends" onClick={handleClick}>
        Friends
        <Notification number={friendRequests?.length}/>
      </button>
      <button id="profile" onClick={handleClick}>
        My Profile
      </button>
      <button id="history" onClick={handleClick}>
        LeaderBoard
      </button>
    </div>
    :""
  );

  return (
    <nav className="navbar">
        <Link  to="/" className="nav-elem-wrapper" onClick={()=>{dispatch(setContentToShow(ContentOptions.PLAY))}}>
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
            {  user?.id && user.id != 0 ? <button className="nav-link" onClick={logout}>Logout</button> : null }
          </li>

        </ul>

       
    </nav>
  );
}

export default Navbar;
