import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/pages/historia.module.css';
import HistoriaAdmin from './HistoriaAdmin';
import HistoriaUser from './HistoriaUser';
import  "@styles/pages/historiia.css";

const HistoriaPage = () => {
  const { role } = useAuth();

  return (
    <div className={styles.container}>
      
      <div className={styles.historyContent}>
        {role === 'admin' ? (
          <HistoriaAdmin></HistoriaAdmin>
        ) : (
          <HistoriaUser></HistoriaUser>
        )}
      </div>
    </div>
  );
};

export default HistoriaPage;