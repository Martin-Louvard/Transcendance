import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm.tsx';
import SignupForm from './SignupForm.tsx';
import { useAppDispatch } from '../../hooks';
import { setUser } from './userReducer';

const Authentication: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const queryParameters = new URLSearchParams(window.location.search)
  const Api42uid = import.meta.env.VITE_42API_UID;
  const dispatch = useAppDispatch()

  useEffect(()=>{
    if(queryParameters.has("code") )
      login42(queryParameters.get('code'))
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
        const data = await response.json();
        const isLoggedIn = true
        dispatch(setUser({data, isLoggedIn}))
      }
    }catch(err) {
      alert(err);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card-block">
        <div className="card">
          <button onClick={handleLoginClick}>
            Login
          </button>
        </div>
        <div className="card">
          <button onClick={handleSignupClick}>
            Signup
          </button>
        </div>
        <div className="card">
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
