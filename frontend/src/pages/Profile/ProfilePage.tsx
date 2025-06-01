import { useAuth } from '@hooks/useAuth';
import styles from '@styles/pages/profile.module.css';

const ProfilePage = () => {
  const { isAuth, role } = useAuth();

  if (!isAuth) return null;

  return (
    <div className={styles.container}>
      <h1>Twój profil</h1>
      
      <div className={styles.profileInfo}>
        <section>
          <h2>Dane podstawowe</h2>
          {/* Formularz danych użytkownika */}
        </section>
        
        {role === 'admin' && (
          <section>
            <h2>Ustawienia administratora</h2>
            {/* Panel admina */}
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;