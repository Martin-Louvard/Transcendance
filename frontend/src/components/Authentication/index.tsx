import React, { useState } from 'react';
import LoginForm from './LoginForm.tsx';
import SignupForm from './SignupForm.tsx';

const Authentication: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
  };

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
      </div>
      <div className="form-container">
      {showLogin ? <LoginForm /> : <SignupForm />}
      </div>
      </div>
  );
};

export default Authentication;
