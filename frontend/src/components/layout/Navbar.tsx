import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { useAuth } from '@hooks/useAuth';
import '@styles/components/navbar.css';

const Navbar = () => {
  const { isAuth, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();  

  const isActive = (path:string) => {
    return location.pathname === path;
  };

  return (
    <nav className="custom-navbar">
      <div className="left">
        {isAuth && role === 'admin' && (
          <Link 
            to="/zgloszenia" 
            className={isActive('/zgloszenia') ? 'active_navbar_link' : ''}
          >
            Zgłoszenia
          </Link>
        )}
        {isAuth && (
          <>
            <Link 
              to="/kalendarz" 
              className={isActive('/kalendarz') ? 'active_navbar_link' : ''}
            >
              Kalendarz
            </Link>
            <Link 
              to="/historia" 
              className={isActive('/historia') ? 'active_navbar_link' : ''}
            >
              Historia
            </Link>
          </>
        )}
      </div>

      <div className="center">
        <Link 
          to="/" 
          className={`brand ${isActive('/') ? 'active_navbar_link' : ''}`}
        >
          {'Rezerwacja'.split('').map((char, index) => (
            <span key={index}>{char}</span>
          ))}
          <span className="special-container">
            {'A7'.split('').map((char, index) => (
              <span key={index} className="letter special">
                {char}
              </span>
            ))}
          </span>
        </Link>
      </div>

      <div className="right">
        {isAuth ? (
          <>
            <div className='profile_div'>
              <Link 
                to="/profile" 
                aria-label="Profile" 
                className={`profile-icon ${isActive('/profile') ? 'active_navbar_link' : ''}`}
              >
                <i className="fa-solid fa-user-pen"></i>
              </Link>
            </div>
            <button onClick={logout}>Wyloguj się</button>
          </>
        ) : (
          <Link 
            to="/login" 
            className={isActive('/login') ? 'active_navbar_link' : ''}
          >
            Zaloguj
          </Link>
        )}
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        ☰
      </button>

      {menuOpen && (
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {isAuth && role === 'admin' && (
            <Link 
              to="/zgloszenia" 
              className={isActive('/zgloszenia') ? 'active_navbar_link' : ''}
            >
              Zgłoszenia
            </Link>
          )}
          {isAuth && (
            <>
              <Link 
                to="/kalendarz" 
                className={isActive('/kalendarz') ? 'active_navbar_link' : ''}
              >
                Kalendarz
              </Link>
              <Link 
                to="/historia" 
                className={isActive('/historia') ? 'active_navbar_link' : ''}
              >
                Historia
              </Link>
              <Link 
                to="/profile" 
                className={isActive('/profile') ? 'active_navbar_link' : ''}
              >
                Profil
              </Link>
              <button onClick={logout}>Wyloguj się</button>
            </>
          )}
          {!isAuth && (
            <Link 
              to="/login" 
              className={isActive('/login') ? 'active_navbar_link' : ''}
            >
              Zaloguj
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;