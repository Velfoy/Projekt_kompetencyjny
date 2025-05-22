import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import styles from '@styles/layout.module.css';

const Navbar = () => {
  const { isAuth, role, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Logo</Link>
      </div>
      
      <div className={styles.navLinks}>
        <Link to="/" className={styles.navLink}>Home</Link>
        
        {isAuth && (
          <>
            <Link to="/kalendarz" className={styles.navLink}>Kalendarz</Link>
            <Link to="/historia" className={styles.navLink}>Historia</Link>
            
            {role === 'admin' && (
                <>
            <Link to="/zgloszenia" className={styles.navLink}>Zgłoszenia</Link>
              </>
            )}
          </>
        )}
      </div>

      <div className={styles.authSection}>
        {isAuth ? (
          <>
            <Link to="/profile" className={styles.profileLink}>Profil</Link>
            <button onClick={logout} className={styles.logoutButton}>Wyloguj</button>
          </>
        ) : (
          <Link to="/login" className={styles.loginButton}>Zaloguj</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;