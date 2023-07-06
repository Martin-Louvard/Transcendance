import './Dashboard.css'
import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import FriendsCard from './FriendsCard';
import HistoryCard from './HistoryCard';

const LeftMenu = () =>{
    const [showProfile, setShowProfile] = useState(false)
    const [showFriends, setShowFriends] = useState(false)
    const [showGames, setShowGames] = useState(false)


    const handleClick = (event: React.MouseEvent<any>) => {
        event.preventDefault()

        event.currentTarget.id === "profile" ? setShowProfile(true): 
        event.currentTarget.id === "friends" ?  setShowFriends(true):
        event.currentTarget.id === "history" ? setShowGames(true) :
        event.currentTarget.id === "menu" ? (setShowGames(false), setShowFriends(false), setShowProfile(false)) :

         ()=>{}
       };

    const menu = () =>{
        return  (
        <div className="menu-wrapper">
            <button id={"friends"} onClick={handleClick}>Friends</button>
            <button id={"history"} onClick={handleClick}>Game History</button>
            <button id={"profile"} onClick={handleClick}>My Profile</button>
        </div>
        )
    }

    return <>
    <img id={"menu"} onClick={handleClick} className='menu-button' src={'retour.png/'} />
    {
        showProfile ? <ProfileCard/> : 
        showFriends ? <FriendsCard/> :
        showGames ? <HistoryCard/> :
        menu()
    }

    </>
}

export default LeftMenu