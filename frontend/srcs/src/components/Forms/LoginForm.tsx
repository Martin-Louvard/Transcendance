import React, { useState } from 'react';
import Form from './Form.js';
import { login } from '../../api.ts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.js';
import { login2fa } from '../../api.ts';
import './Forms.scss'
import toast from "react-hot-toast"
import { setSessionUser, setToken, fetchRelatedUserData} from '../../redux/sessionSlice.ts';
import { ClientPayloads, ServerEvents, ServerPayloads, ClientEvents } from '@shared/class';
import { Popup } from 'reactjs-popup';
import { User } from '../../Types.ts';

let contentStyle = { background: 'transparent', border: "none"};
const LoginForm: React.FC = () => {
  const [tempuser, setTempUser] = useState<User>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch()
  const [twoFaCode, setTwoFaCode] = useState("")
  const [promptIsOpen, setPromptIsOpen] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   event.target.id === "username" ? setUsername(event.target.value): 
   event.target.id === "password" ?    setPassword(event.target.value):
    ()=>{}
  };

  const twoFaVerif = async (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault()
    if (!tempuser?.id )
      return
    const user2fa = await login2fa(twoFaCode, tempuser, tempuser.access_token);
    if (user2fa  && user2fa.id) {
      dispatch(setSessionUser(user2fa))
      dispatch(setToken(user2fa.access_token))
      if (user2fa.id)
        dispatch(fetchRelatedUserData({userId:user2fa.id, access_token:user2fa.access_token}))
      toast.success("Logged in")
    } else if (user2fa.message)
        toast.error(user2fa.message)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    username.length && password.length 
    const user = await login(username,password)
    if(user && user.id)
    { 
      if (!user.twoFAEnabled){
        dispatch(setSessionUser(user))
        dispatch(setToken(user.access_token))
        if (user)
          dispatch(fetchRelatedUserData({userId:user.id, access_token: user.access_token}))
        toast.success("Logged in")
        dispatch(setSessionUser(user))
        dispatch(setToken(user.access_token))
        return
      }
      setTempUser(user)
      setPromptIsOpen(true)
    }
    else
      toast.error(user.message)
    
  };

  return (
    <>      
    <Popup
    open={promptIsOpen}
    closeOnDocumentClick={true}
    onClose={() => setPromptIsOpen(false)}

    {...{contentStyle}}
    >
    <div className="chat-popup popup-mdp">
      <h6>Open Google Authenticator and enter verify code below</h6>
      <form onSubmit={(e)=> twoFaVerif(e)}>
      <input
        type="password"
        placeholder="password"
        value={twoFaCode}
        onChange={(e) => setTwoFaCode(e.target.value)}
      />
      <button type='submit'>Submit</button>
      </form>
    </div>
  </Popup>
    <Form onSubmit={handleSubmit} title="Login" buttonText="Login">
      <div >
        <label htmlFor="username">Username:</label>
        <input type="username" id="username" value={username} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handleChange}  />
      </div>
    </Form>
    </>
  );
};

export default LoginForm;
