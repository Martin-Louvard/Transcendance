import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
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

export function App() {
  const user = useAppSelector((state) => state.session.user);
  const access_token = useAppSelector((state) => state.session.access_token);
  const isConnected = useAppSelector((state) => state.websocket.isConnected);
  const dispatch = useAppDispatch();

  useEffect(() => {

    dispatch(websocketDisconnected());
    if (user) {
      dispatch({ type: 'WEBSOCKET_CONNECT', payload: [user.id, access_token] });
    }
  }, [user?.id]);

  return (
    <Router>
      <Toaster   position="bottom-right"/>
      <Navbar/>
        <Routes>
          <Route path="/" element={user && isConnected ? <Dashboard /> : <Authentication/>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
    </Router>
  )
}

export default App
