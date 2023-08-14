import React, { useState } from 'react';
import Form from './Form';
import { setUser } from '../../redux/userSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toast } from 'react-hot-toast';

const ChangeInfo: React.FC = () => {
    const user = useAppSelector((state) => state.user);
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useAppDispatch()
    const validEmailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

    const changeInfo = async () =>{

    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
         })
      };
      try{
        const response =  await fetch(`http://localhost:3001/users/${username}`, requestOptions)
        if (response.ok)
        {
            const newUser = await response.json();
            toast.success("Information updated")
            dispatch(setUser({...newUser, access_token: user.access_token}))
        }
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
