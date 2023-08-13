import React, { useState, useEffect, useRef } from 'react';
import LoginForm from '../Forms/LoginForm.js';
import SignupForm from '../Forms/SignupForm.js';
import { useAppDispatch } from '../../redux/hooks.js';
import { setUser } from '../../redux/userReducer.js';
import  login2fa  from './login2fa.js'
import './Authentication.scss'
import toast from 'react-hot-toast'

const Authentication: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const queryParameters = new URLSearchParams(window.location.search)
  const Api42uid = import.meta.env.VITE_42API_UID;
  const dispatch = useAppDispatch()
  const isInitialLoadRef = useRef(true); 

  useEffect(()=>{
    if(isInitialLoadRef.current && queryParameters.has("code") ){
      login42(queryParameters.get('code'))
      isInitialLoadRef.current = false
    }
  },[])

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
  };

  const login42 = async (code42: string | null) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code42
       })
    };

    try{
      const response = await fetch('http://localhost:3001/auth/42login', requestOptions);
      if (response.ok)
      {
        const user = await response.json();
        if (!user.twoFAEnabled)
        {
          dispatch(setUser({...user}))
          toast.success("Logged in")
          return
        }
        const code = window.prompt("Enter your code from google authenticator", "000000");
        const user2fa = await login2fa(code, user);
        if (user2fa)
        {
          dispatch(setUser({...user2fa}))
        }

      }
    }catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card-block">
        <div className="auth-card">
          <button onClick={handleLoginClick}>
            Login
          </button>
        </div>
        <div className="auth-card">
          <button onClick={handleSignupClick}>
            Signup
          </button>
        </div>
        <div className="auth-card">
          <a href={`https://api.intra.42.fr/oauth/authorize?client_id=${Api42uid}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code`}>
              Login with 42
          </a>
        </div>
      </div>

      <div className="form-container">
      {showLogin ? <LoginForm /> : <SignupForm />}
      </div>
      </div>
  );
};

export default Authentication;
