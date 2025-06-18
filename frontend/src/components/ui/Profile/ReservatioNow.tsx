import React from "react";
import '@styles/components/ReservatioNow.css';

interface ReservatioNowProps {
    id:number;
  title: string;
  description: string;
  timeLeft: string;
  onEndReservation: () => void;
  onViewSchedule: () => void;
}

const ReservatioNow: React.FC<ReservatioNowProps> = ({
    id,
  title,
  description,
  timeLeft,
  onEndReservation,
  onViewSchedule
}) => {
  return (
    <div className="reservation-card">
      <div className="reservation-row reservation-header">
        <h3 className="reservation-title">{title}</h3>
        <span className="time-left">Zostało {timeLeft} do odcinka</span>
      </div>

      <div className="reservation-row">
        <p className="reservation-description">{description}</p>
      </div>

      <div className="reservation-row reservation-actions">
        <button className="end-button" onClick={onEndReservation}>
          Zakończ rezerwację
        </button>
        <button className="schedule-button" onClick={onViewSchedule}>
          Rozkład tej rezerwacji
        </button>
      </div>
    </div>
  );
};

export default ReservatioNow;
