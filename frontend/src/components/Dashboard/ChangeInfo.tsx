import React, { useState } from 'react';
import Form from '../Authentication/Form';
import { setUser } from '../Authentication/userReducer'
import { useAppDispatch, useAppSelector } from '../../hooks';

const ChangeInfo: React.FC = () => {
    const user = useAppSelector((state) => state.user);
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState(user.password);
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useAppDispatch()

    const changeInfo = () =>{

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
