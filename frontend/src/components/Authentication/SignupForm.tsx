import React, { useState } from 'react';
import Form from './Form';
import { setUser } from './userReducer'
import { useAppDispatch } from '../../hooks';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useAppDispatch()

  const signup = () =>{

    //ADD CALL TO BACKEND HERE (or maybe in reducer action aka setUser?)

    const isLoggedIn = true
    dispatch(setUser({email, username, password, isLoggedIn}))
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.id === "email" ? setEmail(event.target.value): 
    event.target.id === "username" ? setUsername(event.target.value): 
    event.target.id === "password" ? setPassword(event.target.value):
    event.target.id === "confirm-password" ? setConfirmPassword(event.target.value):
     ()=>{}
   };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    username.length && email.length && password.length && password === confirmPassword && signup()
  };

  return (
    <Form onSubmit={handleSubmit} title="Signup" buttonText="Signup">
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input type="username" id="username" value={username} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" value={confirmPassword} onChange={handleChange} />
      </div>
    </Form>
  );
};

export default SignupForm;
