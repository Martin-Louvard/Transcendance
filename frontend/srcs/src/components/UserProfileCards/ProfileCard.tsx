import './Cards.scss'
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import React , { useState } from 'react';
import ChangeInfo from '../Forms/UpdateUserInfoForm';
import HistoryCard from './HistoryCard';
import toast from 'react-hot-toast'
import { setSessionUser } from '../../redux/sessionSlice';

const ProfileCard: React.FC = () => {
  const user = useAppSelector((state) => state.session.user);
  const access_token = useAppSelector((state) => state.session.access_token);
  const dispatch = useAppDispatch();
  const [changeInfoOpen, setChangeInfoOpen] = useState<boolean>(false);
  const [showGames, setShowGames] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar);
  const [twoFaQrcode, setTwoFaQrcode] = useState<string>('');
  const [codeInput, setCodeInput] = useState<string>('');

    const updateAvatar = async (selectorFiles: FileList | null ) =>{
      if(!selectorFiles || !selectorFiles[0])
        return;

      const formData  = new FormData();
      formData.append("file", selectorFiles[0])

      const requestOptions = {
        method: 'POST',
        body: formData
      };

      try{
        const response = await fetch(`http://localhost:3001/users/${user?.username}/avatar`, requestOptions)
        if (response.ok){
          const result = await response.json()
          dispatch(setSessionUser(result))
          setAvatarUrl(result.avatar);
          toast.success("Avatar updated");
        }
      }  catch(err) {
        console.log(err);
      }
    }

    const activate2fa = async () =>{
      const requestOptions = {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${access_token}`},
      };

      try{
        const response = await fetch(`http://localhost:3001/2fa/${user?.username}/generate`, requestOptions)
        if (response.ok) {
          const blobData = await response.blob();
          const blobText = await blobData.text()
          setTwoFaQrcode(blobText);

        }
      }catch(err) {
        console.log(err);
      }
    }

    const disable2fa = async () =>{
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${access_token}`},
      };

      try{
        const response = await fetch(`http://localhost:3001/2fa/${user?.username}/`, requestOptions)
        if (response.ok) {
          const result = await response.json()
          dispatch(setSessionUser(result))
          toast.success("2fa disabled")
        }
      }catch(err) {
        console.log(err);
      }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          twoFactorAuthenticationCode: codeInput
          })
      };

      try{
        const response = await fetch(`http://localhost:3001/2fa/${user?.username}/turn-on`, requestOptions)
        if (response.ok)
        {
          const result = await response.json()
          dispatch(setSessionUser(result));
          toast.success("2fa enabled")
        }
      }catch(err) {
        console.log(err);
      }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
      if (event.target.id === 'code') {
        setCodeInput(event.target.value);
      }
    }

    const QrCode = ()=> {
      return(
          <>
          <p>Scan this QRcode with the google authenticator app and enter your code below</p>
          <img src={twoFaQrcode}/>
          <form onSubmit={handleSubmit}>
            <input type="text" id="code" value={codeInput} onChange={handleChange} placeholder='code...' ></input>
            <button type="submit">Confirm</button>
          </form>
        </>
      )
    }

    const Profile = () =>{
      return( <>
        <div className="profile-picture form-picture">
          <img src={avatarUrl} id={avatarUrl} />
          <form>
            <input type="file" id="file" onChange={ (e) => {if(e.target.files) updateAvatar(e.target.files)}} />
            <label htmlFor="file" id="uploadBtn">Modify</label>
          </form>
      </div>
      
      <div className='user-info'>
          <h3> {user?.username} </h3>
          <h6> {user?.rank} </h6>
          <h6> Victories:{user?.victoriesCount} </h6>
          <h6> Defeats:{user?.defeatCount} </h6>
      </div>
      <div className='list'>
      <button  onClick={() =>{setShowGames(true)}}>Game History</button> 
      {
        !user?.twoFAEnabled ? <button  onClick={() =>{activate2fa()}}>Activate 2fa</button> : <button  onClick={() =>{disable2fa()}}>Disable 2fa</button>
      }
      <button  onClick={() =>{setChangeInfoOpen(true)}}>Change my infos</button>
      {twoFaQrcode.length ? QrCode() : null}
      </div>
    </>)
    }
    
    return <>
        <div className="card-wrapper">
        {
          changeInfoOpen ? <ChangeInfo setChangeInfoOpen={setChangeInfoOpen}/>:
          showGames ? <HistoryCard user={user}/> :
          Profile()
        }
        </div>
    </>
}

export default ProfileCard