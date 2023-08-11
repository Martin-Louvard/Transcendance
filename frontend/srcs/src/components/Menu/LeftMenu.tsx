import React, { useState, useEffect } from 'react';
import ProfileCard from '../UserProfileCards/ProfileCard';
import FriendsCard from '../UserProfileCards/FriendsCard';
import HistoryCard from '../UserProfileCards/HistoryCard';
import { useAppSelector } from "../../redux/hooks";
import './LeftMenu.scss'

const LeftMenu = () =>{
    const [showProfile, setShowProfile] = useState(false)
    const [showFriends, setShowFriends] = useState(false)
    const [showGames, setShowGames] = useState(false)
    const user = useAppSelector((state) => state.user);
    const [fullscreen, setFullScreen] = useState(false)
    const [menuCss, setmenuCss] = useState("open-menu")
  
    const toggleMenu = () =>{
      if (menuCss.charAt(0) == 'o')
        setmenuCss("close-menu menu-transition-close")
      else
        setmenuCss("open-menu menu-transition-open")
      setFullScreen(!fullscreen);
    }
    
    useEffect(()=>{}, [fullscreen])

    const handleClick = (event: React.MouseEvent<any>) => {
        event.preventDefault()

        event.currentTarget.id === "profile" ? setShowProfile(true): 
        event.currentTarget.id === "friends" ?  setShowFriends(true):
        event.currentTarget.id === "history" ? setShowGames(true) :
        event.currentTarget.id === "back" ? (setShowGames(false), setShowFriends(false), setShowProfile(false)) :

         ()=>{}
       };

    const menu = () =>{
        return  (<>
            {
                fullscreen ? "" :  
                <>
                <button id={"friends"} onClick={handleClick}>Friends</button>
                <button id={"history"} onClick={handleClick}>LeaderBoard</button>
                <button id={"profile"} onClick={handleClick}>My Profile</button>
                </>
            }
        </>
        )
    }

    return <>
    <div className={`menu-wrapper ${menuCss}`}>
        {(showProfile || showFriends || showGames) ? <img id={"back"} onClick={handleClick} className='exit-button' src={'cross.svg/'}/> : ""}
        <img className={`logo-nav menu-icon`} src={'/menu.svg'} onClick={toggleMenu}/>
        <div className="inner-menu-wrapper">
        {
            fullscreen ? "" :
            <>
                {
                    
                    showProfile ? <ProfileCard {...user}/> : 
                    showFriends ? <FriendsCard/> :
                    showGames ? <HistoryCard/> :
                    menu()
                } 
            </>
        }
        </div>
    </div>

    </>
}

export default LeftMenu