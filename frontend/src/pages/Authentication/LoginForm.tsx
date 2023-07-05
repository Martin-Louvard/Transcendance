import React, { useState } from 'react';
import Form from './Form';
import { useDispatch } from 'react-redux'
import { setUser } from './userReducer'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()

  const login = (email: string, password: string) =>{
    //ADD CALL TO BACKEND HERE (or maybe in reducer action aka setUser?)
    
    const isLoggedIn = true
    dispatch(setUser({email, password, isLoggedIn}))
  }
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   event.target.id === "email" ? setEmail(event.target.value): 
   event.target.id === "password" ?    setPassword(event.target.value):
    ()=>{}
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    email.length && password.length && login(email, password)
  };

  return (
    <Form onSubmit={handleSubmit} title="Login" buttonText="Login">
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handleChange} />
      </div>
    </Form>
  );
};

export default LoginForm;
