import styles from '../../styles/pages/historiaadmin.module.css';
import DataTable from '@/src/components/ui/DataTable';

const HistoriaAdmin = () => {

  return (
    <div className={styles.container}>
      <h1>Historia Admin</h1>
      <DataTable></DataTable>
    </div>
  );
};

export default HistoriaAdmin;