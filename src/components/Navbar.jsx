import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link className="navbar__brand" to="/">
        CCMS
      </Link>

      <nav className="navbar__links" aria-label="Primary navigation">
        <NavLink to="/student">Student</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        {user ? (
          <button className="navbar__button" type="button" onClick={logout}>
            Logout
          </button>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
