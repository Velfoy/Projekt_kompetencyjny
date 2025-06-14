import styles from '@styles/pages/kalendarz.module.css';
import KalendarzUser from './KalendarzUser';
const KalendarzPage = () => {

  return (
    <div className={styles.container}>
        <KalendarzUser></KalendarzUser>
    </div>
  );
};

export default KalendarzPage;