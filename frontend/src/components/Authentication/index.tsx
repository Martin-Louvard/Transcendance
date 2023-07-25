import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm.tsx';
import SignupForm from './SignupForm.tsx';

const Authentication: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const queryParameters = new URLSearchParams(window.location.search)
  const Api42uid = import.meta.env.VITE_42API_UID;

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
        code42: code42
       })
    };

    try{
      const response = await fetch('http://localhost:3001/auth/42login', requestOptions);
      if (response.ok)
      {
        const data = await response.json();
        console.log(data);
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
          <a href={`https://api.intra.42.fr/oauth/authorize?client_id=${Api42uid}&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2F42login&response_type=code`}>
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
