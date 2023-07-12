import './Dashboard.css'
import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import FriendsCard from './FriendsCard';
import HistoryCard from './HistoryCard';
import { useAppSelector } from "../../hooks";

const LeftMenu = ({hideMenu}) =>{
    const [showProfile, setShowProfile] = useState(false)
    const [showFriends, setShowFriends] = useState(false)
    const [showGames, setShowGames] = useState(false)
    const user = useAppSelector((state) => state.user);


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
                hideMenu ? "" :        <div className="menu-wrapper">
                <button id={"friends"} onClick={handleClick}>Friends</button>
                <button id={"history"} onClick={handleClick}>LeaderBoard</button>
                <button id={"profile"} onClick={handleClick}>My Profile</button>
            </div>
            }
        </>
        )
    }

    return <>
     {
                hideMenu ? "" :<>
    {(showProfile || showFriends || showGames) ? <img id={"back"} onClick={handleClick} className='exit-button' src={'cross.svg/'}/> : ""}
    {
        showProfile ? <ProfileCard {...user}/> : 
        showFriends ? <FriendsCard/> :
        showGames ? <HistoryCard/> :
        menu()
    } </>}
    </>
}

export default LeftMenu