import React from 'react';
import './NavBar.css'

interface NavbarProps {
  // Define any props you need for the navbar
}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="navbar">
      <a className="navbar-brand" href="#">Transcendance</a>
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="#">About</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Contact</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Logout</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
