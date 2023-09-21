import React from 'react';
import './NavBar.scss'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { cleanSession } from '../../redux/sessionSlice';

const Navbar: React.FC = () => {
  const logo = '/marvin.png'
  const user = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();

  const logout = () =>{
    window.location.href="http://localhost:3000/"
    dispatch(cleanSession())
    localStorage.removeItem('persist:root')
  }

  return (
    <nav className="navbar">
        <Link  to="/" className="nav-elem-wrapper">
          <img src={logo} className="logo-nav" alt="PONGƎD logo" />
          <div className="navbar-brand">PONGƎD</div>
        </Link>
        <ul className="nav-elem-wrapper">
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
          {  user?.id && user.id != 0 ? <button className="nav-link" onClick={logout}>Logout</button> : null }
          </li>
        </ul>
    </nav>
  );
}

export default Navbar;
