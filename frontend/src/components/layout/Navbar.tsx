import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { useAuth } from '@hooks/useAuth';
import '@styles/components/navbar.css';

const Navbar = () => {
  const { isAuth, role, login,logout,username } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();  
  const navRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path:string) => {
    return location.pathname === path;
  };
  return (
    <nav className="custom-navbar" ref={navRef}>
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
          className="brand"
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
          <div className='username_header'>{username}</div>
            <div className='profile_div'>
              <Link 
                to="/profile" 
                className={`profile-icon ${isActive('/profile') ? 'active_navbar_link' : ''}`}
              >
                <i className="fa-solid fa-user-pen"></i>
              </Link>
            </div>
            <button className="zalog_button" onClick={logout}>Wyloguj się</button>
          </>
        ) : (
          <button 
            className={`zalog_button ${isActive('/login') ? 'active_navbar_link' : ''}`}
            onClick={login}
          >
            Zaloguj się
          </button>
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
            <button 
              className={isActive('/login') ? 'active_navbar_link' : ''}
               onClick={login}
            >
              Zaloguj
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;