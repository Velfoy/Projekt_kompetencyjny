import React, { useState, useRef, useEffect } from "react";
import '@styles/components/ReservationDone.css';

interface ReservationDoneProps {
  id: number;
  title: string;
  description: string;
  completedAt: string;
  onViewSchedule: () => void;
  onDelete?: () => void;
}

const ReservationDone: React.FC<ReservationDoneProps> = ({
  id,
  title,
  description,
  completedAt,
  onViewSchedule,
  onDelete
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
            <button className="schedule-done-button" onClick={onViewSchedule}>
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
    </div>
  );
};

export default ReservationDone;
