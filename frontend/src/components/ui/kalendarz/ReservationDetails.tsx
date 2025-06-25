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

  const canDelete = reservation.userId === currentUser.id || currentUser.role === 'admin';

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete();
    } catch (err) {
      setError("Failed to delete reservation. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="reservation-details">
        <h3>Reservation Details</h3>
        <div className="details-content">
          <p><strong>Date:</strong> {reservation.day}</p>
          <p><strong>Time:</strong> {reservation.startHour}:{reservation.startMinute.toString().padStart(2, '0')} - {reservation.endHour}:{reservation.endMinute.toString().padStart(2, '0')}</p>
          <p><strong>Reserved by:</strong> {reservation.userName}</p>
          <p><strong>Title:</strong> {reservation.title}</p>
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
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
export default ReservationDetails;