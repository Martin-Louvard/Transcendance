import './Cards.scss'
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import React , { useState } from 'react';
import toast from 'react-hot-toast'
import { setSessionUser } from '../../redux/sessionSlice';
import { setContentToShow } from '../../redux/sessionSlice';
import { ContentOptions } from '../../Types';

const ProfileCard: React.FC = () => {
  const user = useAppSelector((state) => state.session.user);
  const access_token = useAppSelector((state) => state.session.access_token);
  const dispatch = useAppDispatch();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar);

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
        const response = await fetch(`http://10.33.4.5:3001/users/${user?.username}/avatar`, requestOptions)
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

    const disable2fa = async () =>{
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${access_token}`},
      };

      try{
        const response = await fetch(`http://10.33.4.5:3001/2fa/${user?.username}/`, requestOptions)
        if (response.ok) {
          const result = await response.json()
          dispatch(setSessionUser(result))
          toast.success("2fa disabled")
        }
      }catch(err) {
        console.log(err);
      }
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
      <button  onClick={() =>{dispatch(setContentToShow(ContentOptions.HISTORY))}}>Game History</button> 
      {
        !user?.twoFAEnabled ? <button  onClick={() =>{dispatch(setContentToShow(ContentOptions.TWOFA))}}>Activate 2fa</button> : <button  onClick={() =>{disable2fa()}}>Disable 2fa</button>
      }
      <button  onClick={() =>{dispatch(setContentToShow(ContentOptions.CHANGEINFO))}}>Change my infos</button>
      </div>
    </>)
    }
    
    return <>
        <div className="card-wrapper">
        {
          Profile()
        }
        </div>
    </>
}

export default ProfileCard