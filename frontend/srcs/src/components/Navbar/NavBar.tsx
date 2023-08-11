import React, { useState } from 'react';
import './NavBar.css'
import { Link } from 'react-router-dom'
import { setUser } from '../../userReducer'
import { useAppDispatch, useAppSelector } from '../../hooks';

interface NavbarProps {
  // Define any props you need for the navbar
}

const Navbar: React.FC<NavbarProps> = () => {
  const logo = '/pong.svg'
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const logout = () =>{
    window.location.href="http://localhost:3000/"
    dispatch(setUser({}))
    localStorage.removeItem('persist:root')
  }



  return (
    <nav className="navbar">
        <Link  to="/" className="brand-wrapper">
          <img src={logo} className="logo-nav" alt="PONGƎD logo" />
          <div className="navbar-brand">PONGƎD</div>
        </Link>
      <ul className="brand-wrapper">
        <li className="nav-item">
          <Link className="nav-link" to="/about">About</Link>
        </li>
        <li >
        {  user.id && user.id != 0 ? <button className="nav-link" onClick={logout}>Logout</button> : null }
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
