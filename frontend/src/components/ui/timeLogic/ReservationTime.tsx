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
}

const ReservationTime: React.FC<ReservationProps> = ({ difficulty, schedule }) => {
  const overlayRoot = document.getElementById('overlay-root');
  if (!overlayRoot) return null;

  const content = 
    <div className="global_overlay">
      <div className="overlay_message"> 
        {difficulty === "difficult" ? (
        <DateDifficult schedule={schedule} />
        ) : (
        <DateEasy daySchedule={schedule[0]} />
        )}
      </div>
    </div>;

  return ReactDOM.createPortal(content, overlayRoot);
};

export default ReservationTime;
