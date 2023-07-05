import React from 'react';
import './NavBar.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { setUser } from '../pages/Authentication/userReducer'

interface NavbarProps {
  // Define any props you need for the navbar
}

const Navbar: React.FC<NavbarProps> = () => {

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logout = () =>{
    const isLoggedIn = false
    dispatch(setUser({isLoggedIn}))
  }

  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">Home</Link>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/about">About</Link>
        </li>
        <li className="nav-item">
        { user.isLoggedIn ? <button className="nav-link" onClick={logout}>Logout</button> : null }
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
