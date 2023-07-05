import React, { useState } from 'react';
import Form from './Form';
import { useDispatch } from 'react-redux'
import { setUser } from './userReducer'

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch()

  const signup = (email: string, password: string) =>{

    //ADD CALL TO BACKEND HERE (or maybe in reducer action aka setUser?)

    const isLoggedIn = true
    dispatch(setUser({email, password, isLoggedIn}))
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.id === "email" ? setEmail(event.target.value): 
    event.target.id === "password" ? setPassword(event.target.value):
    event.target.id === "confirm-password" ? setConfirmPassword(event.target.value):
     ()=>{}
   };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    email.length && password.length && password === confirmPassword && signup(email, password)
  };

  return (
    <Form onSubmit={handleSubmit} title="Signup" buttonText="Signup">
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={handleChange} />
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
