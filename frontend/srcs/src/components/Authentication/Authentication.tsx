import React, { useState, useEffect, useRef } from 'react';
import LoginForm from '../Forms/LoginForm';
import SignupForm from '../Forms/SignupForm';
import { useAppDispatch } from '../../redux/hooks';
import { setSessionUser, setToken, fetchRelatedUserData } from '../../redux/sessionSlice';
import { login2fa, login42 } from '../../api';
import './Authentication.scss';
import toast from 'react-hot-toast';

const Authentication: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const queryParameters = new URLSearchParams(window.location.search);
  const Api42uid: string = import.meta.env.VITE_42API_UID;
  const dispatch = useAppDispatch();
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    if (isInitialLoadRef.current && queryParameters.has('code')) {
      auth42(queryParameters.get('code'));
      isInitialLoadRef.current = false;
    }
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
  };

  const auth42 = async (code42: string | null) => {
    const user = await login42(code42);
    if (user.id) {
      if (!user.twoFAEnabled) {
        dispatch(setSessionUser(user));
        dispatch(setToken(user.access_token));
        if (user.id) dispatch(fetchRelatedUserData(user.id));
        toast.success('Logged in');
      } else {
        const code = window.prompt('Enter your code from google authenticator', '000000');
        const user2fa = await login2fa(code, user, user.access_token);
        if (user2fa && user2fa.id) {
          dispatch(setSessionUser(user2fa));
          dispatch(setToken(user.access_token));
          if (user2fa.id) dispatch(fetchRelatedUserData(user2fa.id));
          toast.success('Logged in');
        } else if (user2fa?.message) {
          toast.error(user2fa.message);
        }
      }
    } else {
      toast.error('Login 42 failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-block">
        <div className="auth-card">
          <button onClick={handleLoginClick}>Login</button>
        </div>
        <div className="auth-card">
          <button onClick={handleSignupClick}>Signup</button>
        </div>
        <div className="auth-card">
          <a href={`https://api.intra.42.fr/oauth/authorize?client_id=${Api42uid}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code`}>
            Login with 42
          </a>
        </div>
      </div>

      <div className="form-container">{showLogin ? <LoginForm /> : <SignupForm />}</div>
    </div>
  );
};

export default Authentication;