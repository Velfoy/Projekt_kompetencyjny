import React, { useState, useRef, useEffect } from "react";
import '@styles/components/ReservationDone.css';
import type {DaySchedule} from '../../../types/authTypes';
import ReservationTime from "../timeLogic/ReservationTime";

interface ReservationDoneProps {
  id: number;
  title: string;
  description: string;
  completedAt: string;
  onDelete?: () => void;
  timeDetails?:DaySchedule[];
  timeDifficulty:string;
}

const ReservationDone: React.FC<ReservationDoneProps> = ({
  id,
  title,
  description,
  completedAt,
  onDelete,
  timeDetails=[],
  timeDifficulty
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
   const [timeWindow,setTimeWindow]=useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="reservation-done-card">
      <div className="reservation-done-header">
        <div className="reservation-done-info">
            <h3 className="reservation-done-title">{title}</h3>
            <span className="completed-at">Zakończono: {completedAt}</span>
        </div>
        <div className="reservation-done-actions">
            <button className="schedule-done-button" onClick={()=>setTimeWindow(true)}>
            Szczegóły rezerwacji
            </button>
            <div className="menu-wrapper" ref={menuRef}>
            <i
                className="fa-solid fa-bars done-menu-icon"
                onClick={() => setMenuOpen(prev => !prev)}
            ></i>
            {menuOpen && (
                <div className="dropdown-menu">
                <button className="dropdown-item" onClick={onDelete}>
                    Usuń
                </button>
                </div>
            )}
            </div>
        </div>
    </div>


      <p className="reservation-done-description">{description}</p>
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

export default ReservationDone;
