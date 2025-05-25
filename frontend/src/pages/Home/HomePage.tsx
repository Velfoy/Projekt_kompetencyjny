import { Link } from 'react-router-dom';
import styles from '@styles/pages/home.module.css';
import { useAuth } from '@hooks/useAuth';
import A7ReservationCard from '@/src/components/ui/A7ReservationCard';

const HomePage = () => {
  const { role } = useAuth();

  // Determine link text based on role
  const linkText =
    role === 'admin'
      ? 'Przejdź do panelu administratora'
      : role === 'user'
      ? 'Przejdź do panelu użytkownika'
      : 'Zaloguj się';

  // Determine link destination
  const linkTo =
    role === 'admin'
      ? '/admin'
      : role === 'user'
      ? '/user'
      : '/login';

  return (
    <div className={styles.container}>
      <A7ReservationCard></A7ReservationCard>
      <h1>Witaj w naszej aplikacji</h1>
      <p>Zaloguj się, aby uzyskać dostęp do pełnej funkcjonalności</p>
      <div className={styles.buttons}>
        <Link to={linkTo} className={styles.loginButton}>
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
