import { Outlet, BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/NavBar.tsx'
import AboutPage from './pages/About/index.tsx';
import { usePlayerStore } from './components/Game/PlayerStore.ts';
import { useEffect } from 'react';
import { Game } from './components/Game/Game.tsx';
import { useAppDispatch, useAppSelector } from './redux/hooks.ts';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import Authentication from './components/Authentication/Authentication.tsx';
import { websocketDisconnected } from './redux/websocketSlice.ts';
import { Lobby } from './components/Game/Lobby/Lobby.tsx';
import Leaderboard from './components/Leaderboard/Leaderboard.tsx';
import FriendsListCard from './components/UserProfileCards/FriendsListCard.tsx';
import ProfileCard from './components/UserProfileCards/ProfileCard.tsx';
import ChangeInfo from './components/Forms/UpdateUserInfoForm.tsx';
import HistoryCard from './components/UserProfileCards/HistoryCard.tsx';
import TwoFACard from './components/2FA/2FACard.tsx';
import FriendCard from './components/UserProfileCards/FriendCard.tsx';
import SideChatMenu from './components/Chat/SideChatMenu.tsx';
import { AutoMatch } from './components/Game/Lobby/Automatch.tsx';
import { CreateMatchLobby } from './components/Game/Lobby/WaitingLobby.tsx';
import { JoinMatch } from './components/Game/Lobby/JoinMatch.tsx';
import { CreateMatch } from './components/Game/Lobby/CreateMatch.tsx';
import { Navigate } from 'react-router-dom';

export function App() {
  const user = useAppSelector((state) => state.session.user);
  const lobbyType = useAppSelector((state) => state.websocket.lobbyType);
  const access_token = useAppSelector((state) => state.session.access_token);
  const isConnected = useAppSelector((state) => state.websocket.isConnected);
  const dispatch = useAppDispatch();
  const friendProfile = useAppSelector((state) => state.session.friendProfile);

  useEffect(() => {

    dispatch(websocketDisconnected());
    if (user) {
      dispatch({ type: 'WEBSOCKET_CONNECT', payload: [user.id, access_token] });

    }
  }, [user?.id]);

  useEffect(()=>{
    dispatch({type: 'NEW_SIGNUP'});
  },[isConnected])


  return (
    <Router>
      <Toaster   position="bottom-right"/>
      <Navbar/>
      {/* <div className="dashboard-wrapper"> */}
        {user && isConnected && <SideChatMenu />}
        {/* <div className="canvas-wrapper"> */}
          <Routes>
            <Route path="/" element={user && isConnected ? <Lobby /> : <Authentication/>} />
            <Route path="/about" element={<AboutPage />} />
              <Route path="/game/:id" element={user && isConnected ? <Game /> : null} />
              <Route path="/profile" element={user && isConnected ? <ProfileCard /> : null} />
              <Route path="/leaderboard" element={user && isConnected ? <Leaderboard/> : null} />
              <Route path="/friends" element={user && isConnected ? <FriendsListCard/> : null} />
              <Route path="/profile/edit" element={user && isConnected ? <ChangeInfo/> : null} />
              <Route path="/profile/2fa" element={user && isConnected ? <TwoFACard/> : null} />
              <Route path="/friends/friendprofile" element={user && isConnected ? <FriendCard userToDisplay={friendProfile}/> : null} />
              {
                user &&
                <Route path="/profile/history" element={user && isConnected ? <HistoryCard user={user}/> : null} />
              }
            <Route path={"/*"} element={ <Navigate to="/" replace />}/>
          </Routes>
        {/* </div> */}
      {/* </div> */}
    </Router>
  )
}

export default App
