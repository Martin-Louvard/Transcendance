import './Cards.scss'
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Chat from '../Chat/Chat'
import { useEffect, useState } from 'react';
import ChangeInfo from '../Forms/UpdateUserInfoForm';
import HistoryCard from './HistoryCard';
import { setUser } from '../../redux/userReducer';

const ProfileCard = (user) =>{
    const currentUser = useAppSelector((state) => state.user);
    const [chatOpen, setChatOpen] = useState(false)
    const [changeInfoOpen, setChangeInfoOpen] = useState(false)
    const [showGames, setShowGames] = useState(false)
    const dispatch = useAppDispatch();
    const [avatarUrl, setAvatarUrl] = useState(user.avatar)
    const [twoFaQrcode, setTwoFaQrcode] = useState("")
    const [codeInput, setCodeInput] = useState("")
    const [chatId, setChatId] = useState(0)
    const [chat, setChat] = useState({})

    useEffect(()=>{
      let friendship;
      if (user != currentUser)
        friendship = user.friends.filter(o => currentUser.friends.some(({id}) => o.id == id))[0]
      if (friendship && friendship.chat_id)
        setChatId(friendship.chat_id)
    },[])

    useEffect(()=>{
      const getChat = async() => {
        const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };
      try{
        const response = await fetch(`http://localhost:3001/chat-channels/${chatId}`, requestOptions)
        if (response.ok)
        {
          const result = await response.json()
          setChat(result)
        }
      }catch(err) {
        alert(err);
      }
    }
    if (chatId != 0)
      getChat();
    },[chatId])
  
    
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
            dispatch(setUser({...result, access_token: user.access_token }));
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
            dispatch(setUser({...result, access_token: user.access_token}));
            setAvatarUrl(result.avatar);
          }
        }catch(err) {
          alert(err);
        }
      }

      const activate2fa = async () =>{
        const requestOptions = {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user.access_token}`},
        };

        try{
          const response = await fetch(`http://localhost:3001/2fa/${currentUser.username}/generate`, requestOptions)
          if (response.ok) {
            const blobData = await response.blob();
            const blobText = await blobData.text()
            setTwoFaQrcode(blobText);

          }
        }catch(err) {
          alert(err);
        }
      }

      const disable2fa = async () =>{
        const requestOptions = {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user.access_token}`},
        };

        try{
          const response = await fetch(`http://localhost:3001/2fa/${currentUser.username}/`, requestOptions)
          if (response.ok) {
            const result = await response.json()
            dispatch(setUser({...result, access_token: user.access_token }));
            alert("2fa disabled")
          }
        }catch(err) {
          alert(err);
        }

      }

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
         },
          body: JSON.stringify({
            twoFactorAuthenticationCode: codeInput
           })
        };

        try{
          const response = await fetch(`http://localhost:3001/2fa/${user.username}/turn-on`, requestOptions)
          if (response.ok)
          {
            const result = await response.json()
            dispatch(setUser({...result, access_token: user.access_token }));
            alert("2fa enabled")
          }
        }catch(err) {
          alert(err);
        }
      }

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        event.target.id === "code" ? setCodeInput(event.target.value) : ()=>{}
      }

      const QrCode = ()=>{
        return <>
        <p>Scan this QRcode with the google authenticator app and enter your code below</p>
        <img src={twoFaQrcode}/>
        <form onSubmit={handleSubmit}>
          <input type="text" id="code" value={codeInput} onChange={handleChange} ></input>
          <button type="submit">Confirm</button>
        </form>
        </>
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
                <img src={avatarUrl} id={avatarUrl} />
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
        <button  onClick={() =>{setShowGames(true)}}>Game History</button> 
        {
             user.username == currentUser.username && !user.twoFAEnabled ? <button  onClick={() =>{activate2fa()}}>Activate 2fa</button> : <></>
        }
        {
             user.username == currentUser.username && user.twoFAEnabled ? <button  onClick={() =>{disable2fa()}}>Disable 2fa</button> : <></>
        }
        {
            user.username != currentUser.username ? <button  onClick={() =>{setChatOpen(true)}}>Open Private Chat</button> : <button  onClick={() =>{setChangeInfoOpen(true)}}>Change my infos</button>
        }
        {
             user.username != currentUser.username ? <button  onClick={() =>{deleteFriendship()}}>Delete From Friends</button> : <></>
        }
        {
          
          twoFaQrcode.length ? QrCode() : <></>
        }

    </>
    }
    
    return <>
        <div className="profile-card-wrapper">
        {chatOpen ? <Chat {...chat}/>: 
        changeInfoOpen ? <ChangeInfo/>:
        showGames ? <HistoryCard/> :
        profile()}
        </div>
     
    </>
}

export default ProfileCard