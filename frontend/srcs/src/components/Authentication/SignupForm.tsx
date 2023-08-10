import React, { useState } from 'react';
import Form from './Form';
import login from './login';
import { setUser } from '../../userReducer';
import { useAppDispatch } from '../../hooks';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useAppDispatch()

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
      .then(response => {if (response.status !== 201) return(alert ("Signup failed"))})
      const user = await login(username,password)
      dispatch(setUser({...user}))
    }catch(err) {
      alert(err);
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
    username.length && email.length && password.length && password === confirmPassword && signup()
  };

  return (
    <Form onSubmit={handleSubmit} title="Signup" buttonText="Signup">
      <div className='form-div'>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={handleChange} />
      </div>
      <div className='form-div'>
        <label htmlFor="username">Username:</label>
        <input type="username" id="username" value={username} onChange={handleChange} />
      </div>
      <div className='form-div'>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handleChange} />
      </div>
      <div className='form-div'>
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" value={confirmPassword} onChange={handleChange} />
      </div>
    </Form>
  );
};

export default SignupForm;
