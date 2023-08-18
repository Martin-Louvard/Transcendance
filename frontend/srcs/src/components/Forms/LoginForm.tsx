import React, { useState } from 'react';
import { socket } from '../../socket.ts';
import { ClientPayloads, ClientEvents } from '../Game/Type.ts';
import Form from './Form.js';
import { login } from '../../api.ts';
import { useAppDispatch } from '../../redux/hooks.js';
import { login2fa } from '../../api.ts';
import './Forms.scss'
import toast from "react-hot-toast"
import { setSessionUser, setToken, fetchRelatedUserData} from '../../redux/sessionSlice.ts';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch()

  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   event.target.id === "username" ? setUsername(event.target.value): 
   event.target.id === "password" ?    setPassword(event.target.value):
    ()=>{}
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    username.length && password.length 
    const user = await login(username,password)
    if(user.id)
    { 
      if (!user.twoFAEnabled){
        dispatch(setSessionUser(user))
        dispatch(setToken(user.access_token))
        if (user.id)
          dispatch(fetchRelatedUserData(user.id))
        toast.success("Logged in")
        const payloads: ClientPayloads[ClientEvents.AuthState] = {
          id: user.id,
          token: user.access_token,
        }
        socket.emit(ClientEvents.AuthState, payloads);
        return
      }
      const code = window.prompt("Enter your code from google authenticator", "000000");
      const user2fa = await login2fa(code, user, user.access_token);
      if (user2fa  && user2fa.id) {
        dispatch(setSessionUser(user2fa))
        dispatch(setToken(user2fa.access_token))
        if (user2fa.id)
          dispatch(fetchRelatedUserData(user2fa.id))
        toast.success("Logged in")
      } else if (user2fa.message)
          toast.error(user2fa.message)
      const payloads: ClientPayloads[ClientEvents.AuthState] = {
        id: user.id,
        token: user.access_token,
      }
      socket.emit(ClientEvents.AuthState, payloads);
    }
    else
      toast.error("Invalid username or password")
  };

  return (
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
  );
};

export default LoginForm;
