import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import styles from '@styles/pages/auth.module.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await login(credentials);
//       navigate('/');
//     } catch (err) {
//       setError('Nieprawidłowe dane logowania');
//     }
//   };

  return (
    <div className={styles.authContainer}>
      <form  className={styles.authForm}>
        <h2>Logowanie</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Hasło:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
        </div>
          
        <button type="submit" className={styles.submitButton}>Zaloguj</button>
      </form>
    </div>
  );
};

export default LoginPage;