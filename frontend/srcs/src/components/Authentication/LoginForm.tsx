import React, { useState } from 'react';
import Form from './Form';
import  login  from './login.ts'
import { setUser } from './userReducer';
import { useAppDispatch } from '../../hooks';
import login2fa from './login2fa.ts';

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
    if(user)
    { 
      if (!user.twoFAEnabled){
        dispatch(setUser({...user}))
        return
      }
      const code = window.prompt("Enter your code from google authenticator", "000000");
      const user2fa = await login2fa(code, user);
      if (user2fa)
        dispatch(setUser({...user2fa}))
    }
  };

  return (
    <Form onSubmit={handleSubmit} title="Login" buttonText="Login">
      <div className='form-div'>
        <label htmlFor="username">Username:</label>
        <input type="username" id="username" value={username} onChange={handleChange} />
      </div>
      <div className='form-div'>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handleChange}  />
      </div>
    </Form>
  );
};

export default LoginForm;
