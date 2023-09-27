import React, { useState, useEffect, useRef } from 'react';
import LoginForm from '../Forms/LoginForm.js';
import SignupForm from '../Forms/SignupForm.js';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.js';
import './Authentication.scss'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import verify from './verify.js';
import { fetchRelatedUserData, setSessionUser, setToken } from '../../redux/sessionSlice.js';
import { login2fa, login42 } from '../../api.js';
import { Popup } from 'reactjs-popup';
import { User } from '../../Types.ts';

let contentStyle = { background: 'transparent', border: "none"};
const Authentication: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const queryParameters = new URLSearchParams(window.location.search)
  const Api42uid = import.meta.env.VITE_42API_UID;
  const user = useAppSelector((state) => state.session.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const isInitialLoadRef = useRef(true); 
  const [twoFaCode, setTwoFaCode] = useState("")
  const [promptIsOpen, setPromptIsOpen] = useState(false);
  const [tempuser, setTempUser] = useState<User>();

  useEffect(() => {
    if (isInitialLoadRef.current && queryParameters.has('code')) {
      auth42(queryParameters.get('code'));
      isInitialLoadRef.current = false;
    }
  }, []);

  useEffect(() => {
    async function verifyToken() {
      if (await verify(user.access_token))
          navigate('/');
    }
    if (user && user.access_token)
      verifyToken();
  }, [user])
  
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
  };

  const twoFaVerif = async (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault()

    if (!tempuser?.id )
      return
    const user2fa = await login2fa(twoFaCode, tempuser, tempuser.access_token);
    if (user2fa  && user2fa.id) {
      dispatch(setSessionUser(user2fa))
      dispatch(setToken(user2fa.access_token))
      if (user2fa.id)
        dispatch(fetchRelatedUserData(user2fa.id))
      toast.success("Logged in")
    } else if (user2fa.message)
        toast.error(user2fa.message)
  }

  const auth42 = async (code42: string | null) => {
    const user = await login42(code42);
    if (user && user.id) {
      if (!user.twoFAEnabled) {
        dispatch(setSessionUser(user));
        dispatch(setToken(user.access_token));
        if (user) dispatch(fetchRelatedUserData(user.id));
          toast.success('Logged in');
      } else {
        setTempUser(user)
        setPromptIsOpen(true)
      }
    } else {
      toast.error('Login 42 failed');
    }
  };

  return (
    <div className="auth-wrapper" style={{marginTop:"10vh"}}>
      <div className="auth-card-block">
        <div className="auth-card">
          <button onClick={handleLoginClick}>Login</button>
        </div>
        <div className="auth-card">
          <button onClick={handleSignupClick}>Signup</button>
        </div>
        <div className="auth-card">
          <a href={`https://api.intra.42.fr/oauth/authorize?client_id=${Api42uid}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code`}>
            Login with <img className='logo-42' src={"/42_Logo.svg"}></img>
          </a>
        </div>
      </div>
      <Popup
        open={promptIsOpen}
        closeOnDocumentClick={true}
        onClose={() => setPromptIsOpen(false)}
        {...{contentStyle}}
        >
        <div className="chat-popup popup-mdp">
          <h6>Open Google Authenticator and enter verify code below</h6>
          <form onSubmit={(e)=> twoFaVerif(e)}>
          <input
            type="password"
            placeholder="password"
            value={twoFaCode}
            onChange={(e) => setTwoFaCode(e.target.value)}
          />
          <button type='submit'>Submit</button>
          </form>
        </div>
      </Popup>
      <div className="form-container">{showLogin ? <LoginForm /> : <SignupForm />}</div>
    </div>
  );
};

export default Authentication;