import React,{useState} from "react";
import '@styles/components/ReservatioNow.css';
import type {DaySchedule} from '../../../types/authTypes';
import ReservationTime from "../timeLogic/ReservationTime";

interface ReservatioNowProps {
    id:number;
  title: string;
  description: string;
  timeLeft: string;
  onEndReservation: () => void;
    timeDetails?:DaySchedule[];
    timeDifficulty:string;
}

const ReservatioNow: React.FC<ReservatioNowProps> = ({
    id,
  title,
  description,
  timeLeft,
  onEndReservation,
  timeDetails=[],
  timeDifficulty
}) => {
   const [timeWindow,setTimeWindow]=useState(false);
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
        <button className="schedule-button" onClick={()=>setTimeWindow(true)}>
          Rozkład tej rezerwacji
        </button>
      </div>
      {timeWindow && (
        <ReservationTime
          difficulty={timeDifficulty}
          schedule={timeDetails}
          onClose={() => setTimeWindow(false)}
        />
      )
      }
    </div>
  );
};

export default ReservatioNow;
