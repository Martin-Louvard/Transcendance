import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import {
  Routes,
  Route,
} from 'react-router-dom';
import Navbar from './components/NavBar.tsx'
import Home from './pages/Home/index.tsx';
import About from './pages/About/index.tsx';

function App() {

  return (
    <>
    <Router>
      <Navbar/>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </Router>
    </>
  )
}

export default App
