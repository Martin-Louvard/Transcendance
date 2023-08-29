import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/NavBar.tsx'
import Home from './pages/Home/index.tsx';
import About from './pages/About/index.tsx';
import { usePlayerStore } from './components/Game/PlayerStore.ts';
import { useEffect } from 'react';
//import { socket } from './socket.ts';
import { Game } from './components/Game/Game.tsx';
import { ClientPayloads, ServerEvents, ServerPayloads, ClientEvents } from '@shared/class';
import { useAppSelector } from './redux/hooks.ts';
import { Toaster } from 'react-hot-toast';
import { useSocketStore } from './components/Game/SocketStore.ts';
import { socket } from './socket.ts';
import Authentication from './components/Authentication/Authentication.tsx';
import verify from './components/Authentication/verify.ts';


function App() {
  const player = usePlayerStore();
  const user = useAppSelector((state) => state.session.user);
  
  useEffect(() => {
      if (user && user.id) {
        socket.auth = {token: user.access_token};
        socket.disconnect().connect();
      }
        socket.on(ServerEvents.AuthState, (data: ServerPayloads[ServerEvents.AuthState]) => {
          player.setLobbyId(data.lobbyId);
          if (data.hasStarted) {
            player.setIsPlaying(true);
          }
        })
  }, [])

  return (
    <>
    <Router>
      <Toaster/>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/about" element={<About />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
