import './Dashboard.css'
import { useAppSelector } from "../../hooks";
import Chat from '../Chat/Chat.tsx'
import { useState } from 'react';
import ChangeInfo from './ChangeInfo.tsx';
import HistoryCard from './HistoryCard';
import { useAppDispatch } from '../../hooks';
import { setUser } from '../Authentication/userReducer.ts';


const ProfileCard = (user) =>{
    const currentUser = useAppSelector((state) => state.user);
    const [chatOpen, setChatOpen] = useState(false)
    const [changeInfoOpen, setChangeInfoOpen] = useState(false)
    const [showGames, setShowGames] = useState(false)
    const dispatch = useAppDispatch();
    const [avatarUrl, setAvatarUrl] = useState(user.avatar)

    const deleteFriendship = async () =>{
        const requestOptions = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            friend_username: user.username
           })
        };
  
        try{
          const response = await fetch(`http://localhost:3001/users/${currentUser.username}/friends`, requestOptions)
          if (response.ok)
          {
            const result = await response.json()
            const isLoggedIn = true
            dispatch(setUser({...result, isLoggedIn}));
          }
        }catch(err) {
          alert(err);
        }
      }

    const updateAvatar = async (selectorFiles: FileList ) =>{
      if(!selectorFiles[0])
        return;
        const formData  = new FormData();
        formData.append("file", selectorFiles[0])
        const requestOptions = {
          method: 'POST',
          body: formData
        };    
        try{
          const response = await fetch(`http://localhost:3001/users/${user.username}/avatar`, requestOptions)
          if (response.ok)
          {
            const result = await response.json()
            console.log(result)
            const isLoggedIn = true
            dispatch(setUser({...result, isLoggedIn}));
          }
        }catch(err) {
          alert(err);
        }
      }

    const profile = () =>{
        return <>
         {
            user.username != currentUser.username ?
            <div className='profile-picture'>
              <img src={avatarUrl}/>
            </div>
             : 
             <div className="profile-picture form-picture">
                <img src={avatarUrl} id="photo"/>
                <form>
                  <input type="file" id="file" onChange={ (e) => {updateAvatar(e.target.files)}} />
                  <label htmlFor="file" id="uploadBtn">Modify</label>
                </form>
            </div>
        }
        <div className='user-info'>
            <h6> Username: {user.username}</h6>
            <h6> Email: {user.email}</h6>
        </div>
        <button onClick={() =>{setShowGames(true)}}>Game History</button> 
        {
            user.username != currentUser.username ? <button onClick={() =>{setChatOpen(true)}}>Open Private Chat</button> : <button onClick={() =>{setChangeInfoOpen(true)}}>Change my infos</button>
        }
        {
             user.username != currentUser.username ? <button onClick={() =>{deleteFriendship()}}>Delete From Friends</button> : <></>
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