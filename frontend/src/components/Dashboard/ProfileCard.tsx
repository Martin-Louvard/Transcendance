import './Dashboard.css'
import { useAppSelector } from "../../hooks";
import Chat from '../Chat/Chat.tsx'
import { useState } from 'react';
import ChangeInfo from './ChangeInfo.tsx';
import HistoryCard from './HistoryCard';

const ProfileCard = (user) =>{
    const currentUser = useAppSelector((state) => state.user);
    const [chatOpen, setChatOpen] = useState(false)
    const [changeInfoOpen, setChangeInfoOpen] = useState(false)
    const [showGames, setShowGames] = useState(false)

    const profile = () =>{
        return         <>
        <div className='profile-picture'>
            <img src='./default.jpg'/>
        </div>
        <div className='user-info'>
            <h6> Username: {user.username}</h6>
            <h6> Email: {user.email}</h6>
        </div>
        <button onClick={() =>{setShowGames(true)}}>Game History</button> 
        {
            user.username != currentUser.username ? <button onClick={() =>{setChatOpen(true)}}>Open Private Chat</button> : <button onClick={() =>{setChangeInfoOpen(true)}}>Change my infos</button>
        }
    </>
    }
    
    return <>
        <div className="profile-card-wrapper">
        {chatOpen ? <Chat/>: 
        changeInfoOpen ? <ChangeInfo/>:
        showGames ? <HistoryCard/> :
        profile()}
        </div>
     
    </>
}

export default ProfileCard