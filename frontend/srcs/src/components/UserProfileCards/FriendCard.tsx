import './Cards.scss'
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Chat from '../Chat/Chat'
import { useState } from 'react';
import HistoryCard from './HistoryCard';
import { setSessionUser } from '../../redux/sessionSlice';
import { Friendships } from '../../Types';

const FriendCard = ({friendship}: {friendship: Friendships}) =>{
    const user = useAppSelector((state) => state.session.user);
    const friend = friendship.friend_id == user?.id ? friendship.user:friendship.friend
    const [chatOpen, setChatOpen] = useState(false)
    const [showGames, setShowGames] = useState(false)
    const dispatch = useAppDispatch();

    const deleteFriendship = async () =>{
        const requestOptions = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            friend_username: friend.username
           })
        };
  
        try{
          const response = await fetch(`http://localhost:3001/users/${user?.username}/friends`, requestOptions)
          if (response.ok)
          {
            const result = await response.json()
            dispatch(setSessionUser(result))
          }
        }catch(err) {
          console.log(err);
        }
      }

    const profile = () =>{
        return <>
            <div className='profile-picture'>
              <img src={friend.avatar}/>
            </div>
           
            <div className='user-info'>
                <h6> Username: {friend.username}</h6>
                <h6> Email: {friend.email}</h6>
            </div>
            <button  onClick={() =>{setShowGames(true)}}>Game History</button> 
            <button  onClick={() =>{setChatOpen(true)}}>Open Private Chat</button> 
            <button  onClick={() =>{deleteFriendship()}}>Delete From Friends</button>
        </>
    }
    
    return <>
        <div className="profile-card-wrapper">
        {chatOpen ? <Chat chatId={friendship.chat_id}/>: 
        showGames ? <HistoryCard/> :
        profile()}
        </div>
     
    </>
}

export default FriendCard