import React, { useState } from 'react';
import Form from './Form';
import login from '../Authentication/login';
import { setUser } from '../../redux/userSlice';
import { useAppDispatch } from '../../redux/hooks';
import './Forms.scss'
import { ClientEvents, ClientPayloads } from '../Game/Type';
import { socket } from '../../socket';
import toast from "react-hot-toast"

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useAppDispatch()
  const validEmailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

  const signup = async () =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
       })
    };

    try{
      await fetch('http://localhost:3001/users', requestOptions)
      .then(response => {if (response.status !== 201) return toast.error("Signup failed")})
      const user = await login(username,password)
      if (!user)
        return toast.error("Account created but signin failed")
      toast.success("Logged in")
      dispatch(setUser({...user}))
      const payloads: ClientPayloads[ClientEvents.AuthState] = {
        id: user.id,
        token: user.access_token,
      }
      socket.emit(ClientEvents.AuthState, payloads);
    }catch(err) {
      console.log(err);
    }
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
    if (username.length < 1)
      return toast.error("Username should be at least 1 Character long")
    if (!email.match(validEmailRegex)) 
        return toast.error("Invalid email");
    if (password.length < 3)
        return toast.error("Password should have at least 3 characters")
    if ( password !== confirmPassword)
        return toast.error("Passwords do not match")
    signup()
  };

  return (
    <Form onSubmit={handleSubmit} title="Signup" buttonText="Signup">
      <div >
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" value={email} onChange={handleChange} />
      </div>
      <div >
        <label htmlFor="username">Username:</label>
        <input type="username" id="username" value={username} onChange={handleChange} />
      </div>
      <div >
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handleChange} />
      </div>
      <div >
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" value={confirmPassword} onChange={handleChange} />
      </div>
    </Form>
  );
};

export default SignupForm;
