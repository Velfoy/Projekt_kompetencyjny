import styles from '@styles/pages/home.module.css';
import { useAuth } from '@hooks/useAuth';
import A7ReservationCard from '@/src/components/ui/home/A7ReservationCard';
import NewsSection from '@/src/components/ui/home/NewsSection';

const HomePage = () => {
  const { role } = useAuth();
  
  return (
    <div className={styles.container}>
      <A7ReservationCard></A7ReservationCard>
      <NewsSection></NewsSection>
    </div>
  );
};

export default HomePage;
