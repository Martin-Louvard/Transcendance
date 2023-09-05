import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/NavBar.tsx'
import About from './pages/About/index.tsx';
import { usePlayerStore } from './components/Game/PlayerStore.ts';
import { useEffect } from 'react';
import { Game } from './components/Game/Game.tsx';
import { ClientPayloads, ServerEvents, ServerPayloads, ClientEvents } from '@shared/class';
import { useAppSelector } from './redux/hooks.ts';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import Authentication from './components/Authentication/Authentication.tsx';

function App() {
  const user = useAppSelector((state) => state.session.user);

  return (
    <>
    <Router>
      <Toaster/>
      <Navbar/>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Authentication/>} />
          <Route path="/about" element={<About />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
