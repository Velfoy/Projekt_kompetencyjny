import React from 'react';
import ReactDOM from 'react-dom';
import DateDifficult from './DateDifficult';
import DateEasy from './DateEasy';

import '@styles/components/ReservationTime.css';

interface DaySchedule {
  day: string;
  from: string;
  to: string;
}

interface ReservationProps {
  difficulty: string;
  schedule: DaySchedule[];
  onClose: () => void;
}

const semestrStart="01.03.2025";
const semestrEnd="30.07.2025";
//TODO:Change to being dynamic
const sampleSchedule = [
  { day: '01.03.2025', from: '08:00', to: '10:00' },  // Saturday, week 1
  { day: '03.03.2025', from: '09:00', to: '11:00' },  // Monday, week 2
  { day: '04.03.2025', from: '13:00', to: '15:00' },  // Tuesday, week 2
  { day: '10.03.2025', from: '14:00', to: '16:00' },  // Monday, week 3
  { day: '11.03.2025', from: '08:00', to: '09:30' },  // Tuesday, week 3
  { day: '17.03.2025', from: '10:00', to: '12:00' },  // Monday, week 4
  { day: '18.03.2025', from: '15:00', to: '17:00' },
   { day: '19.03.2025', from: '15:00', to: '17:00' },
    { day: '20.03.2025', from: '15:00', to: '17:00' },
     { day: '21.03.2025', from: '15:00', to: '17:00' },
      { day: '22.03.2025', from: '15:00', to: '17:00' },
        { day: '23.03.2025', from: '15:00', to: '17:00' },
          { day: '24.03.2025', from: '15:00', to: '17:00' },
            { day: '25.03.2025', from: '15:00', to: '17:00' },
        // Tuesday, week 4
  { day: '25.03.2025', from: '08:00', to: '10:00' },  // Tuesday, week 5
  { day: '31.03.2025', from: '11:00', to: '13:00' },  // Monday, week 6
  { day: '01.04.2025', from: '14:00', to: '16:00' },  // Tuesday, week 6
  { day: '07.04.2025', from: '09:00', to: '11:00' },  // Monday, week 7
  { day: '08.04.2025', from: '10:00', to: '12:00' },  // Tuesday, week 7
  { day: '03.03.2025', from: '08:00', to: '09:00' }, // Monday
  { day: '03.03.2025', from: '10:00', to: '11:00' }, // Monday, same day
  { day: '04.03.2025', from: '09:00', to: '10:00' },
];

const ReservationTime: React.FC<ReservationProps> = ({ difficulty, schedule, onClose }) => {
  const overlayRoot = document.getElementById('overlay-root');
  if (!overlayRoot) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const content = (
    <div className="global_overlay" onClick={handleOverlayClick}>
      <div className="overlay_message">
        <div className="reservation_div">
          <div className="termin_header">
            <p>Termin rezerwacji</p>
            <button className="close_button" onClick={onClose}>×</button>
          </div>
          {difficulty === 'difficult' ? (
             <DateDifficult
        schedule={schedule}
        semesterStart={semestrStart}
        semesterEnd={semestrEnd}
      />
          ) : (
            <DateEasy
            schedules={schedule}
            startDate={semestrStart}
            endDate={semestrEnd}
            />

          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, overlayRoot);
};

export default ReservationTime;
