import React, { useEffect, useState } from 'react';
import Form from './Form';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toast } from 'react-hot-toast';
import { setContentToShow, setSessionUser } from '../../redux/sessionSlice';
import { ContentOptions } from '../../Types';
import { useNavigate } from 'react-router-dom';

const ChangeInfo = () => {
    const user = useAppSelector((state) => state.session.user);
    const access_token = useAppSelector((state) => state.session.access_token)
    const [email, setEmail] = useState(user?.email);
    const [username, setUsername] = useState(user?.username);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useAppDispatch()
    const validEmailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
    const navigate = useNavigate();


    const changeInfo = async () =>{

    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
         })
      };
      try{
        const response =  await fetch(`http://10.33.3.1:3001/users/${user?.username}`, requestOptions)
        if (response.ok)
        {
            const newUser = await response.json();
            newUser.access_token = access_token;
            toast.success("Information updated")
            dispatch(setSessionUser(newUser))
           navigate("/profile");
        }
      }catch(err) {
        console.log(err);
      }
    }
    useEffect(()=>{},[changeInfo])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.id === "email" ? setEmail(event.target.value): 
        event.target.id === "username" ? setUsername(event.target.value): 
        event.target.id === "password" ? setPassword(event.target.value):
        event.target.id === "confirm-password" ? setConfirmPassword(event.target.value):
        ()=>{}
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (username && username.length < 1 || username == undefined)
            return toast.error("Username should be at least 1 Character long")
        if (email && !email.match(validEmailRegex) || email == undefined) 
            return toast.error("Invalid email");
        if (password.length < 3)
            return toast.error("Password should have at least 3 characters")
        if ( password !== confirmPassword)
            return toast.error("Passwords do not match")
        changeInfo()
    };

    return (
        <Form onSubmit={handleSubmit} title="Change Infos" buttonText="Confirm">
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

export default ChangeInfo;
