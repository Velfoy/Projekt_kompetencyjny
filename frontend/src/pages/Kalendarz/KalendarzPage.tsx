import { useAuth } from '@hooks/useAuth';
import styles from '@styles/pages/kalendarz.module.css';
import KalendarzAdmin from './KalendarzAdmin';
import KalendarzUser from './KalendarzUser';
const KalendarzPage = () => {
  const { role } = useAuth();

  return (
    <div className={styles.container}>
      
      {role === 'admin' ? (
          <KalendarzAdmin></KalendarzAdmin>
        ) : (
          <KalendarzUser></KalendarzUser>
        )}
    </div>
  );
};

export default KalendarzPage;