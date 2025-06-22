import React from 'react';

interface DaySchedule {
  day: string;
  from: string;
  to: string;
}

interface Props {
  schedule: DaySchedule[];
}

const DateDifficult: React.FC<Props> = ({ schedule }) => {
  return (
    <div className="date-difficult">
      <h2>Difficult Reservations</h2>
      {schedule.map(({ day, from, to }) => (
        <div key={day}>
          <p><strong>{day}</strong>: {from} - {to}</p>
        </div>
      ))}
    </div>
  );
};

export default DateDifficult;
