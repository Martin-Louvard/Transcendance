import React, { useState } from 'react';
import Form from '../Authentication/Form';
import { setUser } from '../Authentication/userReducer'
import { useAppDispatch, useAppSelector } from '../../hooks';

const ChangeInfo: React.FC = () => {
    const user = useAppSelector((state) => state.user);
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFAEnabled, setTwoFAEnabled] = useState(user.twoFAEnabled)


    const dispatch = useAppDispatch()

    const changeInfo = async () =>{

    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
         })
      };
      try{
        const response =  await fetch(`http://localhost:3001/users/${username}`, requestOptions)
        if (response.ok)
        {
            const user = await response.json();
            const isLoggedIn = true
            dispatch(setUser({...user, isLoggedIn}))
        }
      }catch(err) {
        alert(err);
      }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.id === "email" ? setEmail(event.target.value): 
        event.target.id === "username" ? setUsername(event.target.value): 
        event.target.id === "twoFAEnabled" ? setTwoFAEnabled(event.target.checked): 
        event.target.id === "password" ? setPassword(event.target.value):
        event.target.id === "confirm-password" ? setConfirmPassword(event.target.value):
        ()=>{}
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        username.length && email.length && password.length && password === confirmPassword && changeInfo()
    };

    return (
        <Form onSubmit={handleSubmit} title="Change Infos" buttonText="Confirm">
        <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={handleChange} />
        </div>
        <div>
            <label htmlFor="username">Username:</label>
            <input type="username" id="username" value={username} onChange={handleChange} />
        </div>
        <div>
            <label htmlFor="twoFAEnabled">Enable 2FA:</label>
            <input type="checkbox" id="twoFAEnabled" checked={twoFAEnabled} onChange={handleChange} />
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

export default ChangeInfo;
