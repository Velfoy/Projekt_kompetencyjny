import type {Reservation,DayInfo,TimeSlot,SelectedSlot,User,RecurringReservation,ReservationForDifficultProps,ComplexTimeSlot} from "../../../types/authTypes";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import "@styles/pages/ItemCalendar.css";
const ReservationDetails: React.FC<{
  reservation: Reservation | null;
  onClose: () => void;
  onDelete: () => Promise<void>;
  currentUser: User;
}> = ({ reservation, onClose, onDelete, currentUser }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!reservation) return null;

  const canDelete = reservation.userName === currentUser.name || currentUser.role === 'admin';

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete();
    } catch (err) {
      setError("Nie udało się usunąć rezerwacji. Spróbuj ponownie.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="reservation-details">
        <h3>Szczegóły rezerwacji</h3>
        <div className="details-content">
          <p><strong>Data:</strong> {reservation.day}</p>
          <p><strong>Godzina:</strong> {reservation.startHour}:{reservation.startMinute.toString().padStart(2, '0')} - {reservation.endHour}:{reservation.endMinute.toString().padStart(2, '0')}</p>
          <p><strong>Zarezerwowano przez:</strong> {reservation.userName}</p>
          <p><strong>Tytuł:</strong> {reservation.title}</p>
          {reservation.status && (
            <p><strong>Status:</strong> 
              <span className={`status-${reservation.status}`}>
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </span>
            </p>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="details-buttons">
          {canDelete && (
            <button onClick={handleDelete} className="delete-btn" disabled={isDeleting}>
              {isDeleting ? "Usuwanie..." : "Usuń"}
            </button>
          )}
          <button onClick={onClose}>Zamknij</button>
        </div>
      </div>
    </div>
  );
};
export default ReservationDetails;