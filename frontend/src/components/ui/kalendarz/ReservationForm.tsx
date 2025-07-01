import type {Reservation,DayInfo,TimeSlot,SelectedSlot,User,RecurringReservation,ReservationForDifficultProps,ComplexTimeSlot} from "../../../types/authTypes";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import "@styles/pages/ItemCalendar.css";
const ReservationForm: React.FC<{
  selectedSlot: SelectedSlot | null;
  onClose: () => void;
  onSubmit: (reservation: Reservation) => Promise<void>;
  currentUser: User;
}> = ({ selectedSlot, onClose, onSubmit, currentUser }) => {
  const [title, setTitle] = useState("");
  const [startHour, setStartHour] = useState(selectedSlot?.startHour || 8);
  const [startMinute, setStartMinute] = useState(selectedSlot?.startMinute || 0);
  const [endHour, setEndHour] = useState((selectedSlot?.startHour || 8) + 1);
  const [endMinute, setEndMinute] = useState(selectedSlot?.startMinute || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableTimes = useMemo(() => {
    if (!selectedSlot || 
        selectedSlot.availableStartHour === undefined || 
        selectedSlot.availableEndHour === undefined) return [];
    
    const times = [];
    let currentHour = selectedSlot.availableStartHour;
    let currentMinute = selectedSlot.availableStartMinute || 0;
    const endHour = selectedSlot.availableEndHour;
    const endMinute = selectedSlot.availableEndMinute || 0;
    
    while (currentHour < endHour || 
          (currentHour === endHour && currentMinute < endMinute)) {
      times.push({
        hour: currentHour,
        minute: currentMinute
      });
      
      currentMinute += 15;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour++;
      }
    }
    return times;
  }, [selectedSlot]);

  const availableHours = Array.from(new Set(availableTimes.map(time => time.hour)))
    .sort((a, b) => a - b);

  const availableStartMinutes = availableTimes
    .filter(time => time.hour === startHour)
    .map(time => time.minute)
    .sort((a, b) => a - b);

  const availableEndTimes = useMemo(() => {
    if (!selectedSlot || 
        selectedSlot.availableEndHour === undefined) return [];
    
    const startTimeInMinutes = startHour * 60 + startMinute;
    const availableEndInMinutes = selectedSlot.availableEndHour * 60 + (selectedSlot.availableEndMinute || 0);
    const possibleEndTimes = [];
    
    let currentTime = startTimeInMinutes + 15; // Minimum 15 minute reservation
    
    while (currentTime <= availableEndInMinutes) {
      possibleEndTimes.push({
        hour: Math.floor(currentTime / 60),
        minute: currentTime % 60
      });
      currentTime += 15;
    }
    
    return possibleEndTimes;
  }, [selectedSlot, startHour, startMinute]);

  const availableEndHours = Array.from(new Set(availableEndTimes.map(time => time.hour)))
    .sort((a, b) => a - b);

  const availableEndMinutes = availableEndTimes
    .filter(time => time.hour === endHour)
    .map(time => time.minute)
    .sort((a, b) => a - b);

  useEffect(() => {
    if (selectedSlot) {
      setStartHour(selectedSlot.startHour);
      setStartMinute(selectedSlot.startMinute);
      
      const defaultEndTime = findDefaultEndTime(
        selectedSlot.startHour,
        selectedSlot.startMinute
      );
      
      setEndHour(defaultEndTime.hour);
      setEndMinute(defaultEndTime.minute);
    }
  }, [selectedSlot]);

  const findDefaultEndTime = (hour: number, minute: number) => {
    if (!selectedSlot?.availableEndHour) return { hour: hour + 1, minute };
    
    let defaultHour = hour + 1;
    let defaultMinute = minute;
    
    const slotEndInMinutes = selectedSlot.availableEndHour * 60 + (selectedSlot.availableEndMinute || 0);
    const proposedEndInMinutes = defaultHour * 60 + defaultMinute;
    
    if (proposedEndInMinutes > slotEndInMinutes) {
      return {
        hour: selectedSlot.availableEndHour,
        minute: selectedSlot.availableEndMinute || 0
      };
    }
    
    return { hour: defaultHour, minute: defaultMinute };
  };

  const handleStartHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = Number(e.target.value);
    setStartHour(newHour);
    
    const minutesForHour = availableTimes
      .filter(time => time.hour === newHour)
      .map(time => time.minute);
      
    if (!minutesForHour.includes(startMinute)) {
      setStartMinute(minutesForHour[0] || 0);
    }
    
    const newStartInMinutes = newHour * 60 + startMinute;
    const currentEndInMinutes = endHour * 60 + endMinute;
    
    if (currentEndInMinutes <= newStartInMinutes) {
      const defaultEndTime = findDefaultEndTime(newHour, startMinute);
      setEndHour(defaultEndTime.hour);
      setEndMinute(defaultEndTime.minute);
    }
  };

  const handleEndHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = Number(e.target.value);
    setEndHour(newHour);
    
    const minutesForHour = availableEndTimes
      .filter(time => time.hour === newHour)
      .map(time => time.minute);
      
    if (!minutesForHour.includes(endMinute)) {
      setEndMinute(minutesForHour[0] || 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    
    if (endTotal <= startTotal) {
      setError("End time must be after start time");
      return;
    }
    
    if (selectedSlot.availableStartHour !== undefined && 
        selectedSlot.availableEndHour !== undefined) {
      const slotStart = selectedSlot.availableStartHour * 60 + (selectedSlot.availableStartMinute || 0);
      const slotEnd = selectedSlot.availableEndHour * 60 + (selectedSlot.availableEndMinute || 0);
      
      if (startTotal < slotStart || endTotal > slotEnd) {
        setError("Reservation must be within the selected available time block");
        return;
      }
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const reservation: Reservation = {
        title,
        startHour,
        startMinute,
        endHour,
        endMinute,
        day: selectedSlot.day,
        userName: currentUser.name,
        status: currentUser.role === 'user' ? 'Brak akceptacji' : undefined
      };
      
      await onSubmit(reservation);
      onClose(); 
    } catch (err) {
      setError("Failed to create reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

  };

  if (!selectedSlot) return null;

  return (
    <div className="modal-overlay">
      <div className="reservation-form">
        <h3>Dodaj rezerwację</h3>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Nazwa:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Czas rozpoczęcia:</label>
            <div className="time-inputs">
              <select
                value={startHour}
                onChange={handleStartHourChange}
                required
              >
                {availableHours.map(hour => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              :
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(Number(e.target.value))}
                required
              >
                {availableStartMinutes.map(minute => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Czas zakończenia:</label>
            <div className="time-inputs">
              <select
                value={endHour}
                onChange={handleEndHourChange}
                required
              >
                {availableEndHours.map(hour => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              :
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(Number(e.target.value))}
                required
              >
                {availableEndMinutes.map(minute => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-buttons">
            <button type="button" onClick={onClose} disabled={isSubmitting}>Zamknij</button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Przetwarzanie..." : "Zapisz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ReservationForm;