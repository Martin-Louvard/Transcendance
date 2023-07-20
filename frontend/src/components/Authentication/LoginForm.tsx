import React, { useState } from 'react';
import Form from './Form';
import { setUser } from './userReducer'
import { useAppDispatch } from '../../hooks';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch()

  const login = async () =>{

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    try{
      await fetch(`http://localhost:3001/users/${username}`, requestOptions)
      .then(response => response.json())
      .then(data =>{
        console.log(data)
        if (data.password == password){
          const email = data.email
          const isLoggedIn = true
          dispatch(setUser({email, username, password, isLoggedIn}))
        }
        else
          alert("Wrong password");
      });
    }catch(err) {
      alert(err);
    }

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
