import React, { useState } from 'react';
import Form from './Form';
import { setUser } from './userReducer'
import { useAppDispatch } from '../../hooks';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch()

  const login = () =>{
    //ADD CALL TO BACKEND HERE (or maybe in reducer action aka setUser?)

    const email = ""; //Change by email recupere de l'api call
    const isLoggedIn = true
    dispatch(setUser({email, username, password, isLoggedIn}))
  }
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   event.target.id === "username" ? setUsername(event.target.value): 
   event.target.id === "password" ?    setPassword(event.target.value):
    ()=>{}
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    username.length && password.length && login()
  };

  return (
    <Form onSubmit={handleSubmit} title="Login" buttonText="Login">
      <div>
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
