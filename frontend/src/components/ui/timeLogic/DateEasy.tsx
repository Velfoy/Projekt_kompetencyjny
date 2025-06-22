import React from 'react';

interface DaySchedule {
  day: string;
  from: string;
  to: string;
}

interface Props {
  daySchedule: DaySchedule;
}

const DateEasy: React.FC<Props> = ({ daySchedule }) => {
  return (
    <div className="date-easy">
      <h2>Easy Reservation</h2>
      <p><strong>Date:</strong> {daySchedule.day}</p>
      <p><strong>From:</strong> {daySchedule.from}</p>
      <p><strong>To:</strong> {daySchedule.to}</p>
    </div>
  );
};

export default DateEasy;
