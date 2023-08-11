import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/NavBar.tsx'
import Home from './pages/Home/index.tsx';
import About from './pages/About/index.tsx';

function App() {

  return (
    <>
    <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
