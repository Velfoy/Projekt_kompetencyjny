import styles from '../../styles/pages/kalendarzuser.module.css';
import { Link } from 'react-router-dom';
import RezerwacjaGrid from '@/src/components/ui/kalendarz/RezerwacjaGrid';

const KalendarzUser = () => {

  return (
    <div className='kalendarzRezerwacja'>
      <RezerwacjaGrid></RezerwacjaGrid>
    </div>
  );
};

export default KalendarzUser;