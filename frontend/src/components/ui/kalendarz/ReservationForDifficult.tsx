import type {Reservation,DayInfo,TimeSlot,SelectedSlot,User,RecurringReservation,ReservationForDifficultProps,ComplexTimeSlot} from "../../../types/authTypes";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import "@styles/pages/ItemCalendar.css";
const ReservationForDifficult: React.FC<ReservationForDifficultProps> = ({ 
  onClose, 
  onSubmit, 
  onSubmitRecurring, 
  currentUser, 
  existingReservations, 
  semesterStartDate, 
  semesterEndDate 
}) => {
  const [mode, setMode] = useState<"single" | "recurring">("single");
  const [timeSlots, setTimeSlots] = useState<ComplexTimeSlot[]>([
    { 
      fromHour: 8, 
      fromMinute: 0, 
      toHour: 9, 
      toMinute: 0, 
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0]
    }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recurring reservation state
  const [recurringSlot, setRecurringSlot] = useState({
    startHour: 8,
    startMinute: 0,
    endHour: 9,
    endMinute: 0,
    daysOfWeek: [] as number[],
    weeks: [] as number[],
  });

  // Calculate available weeks in semester
  const availableWeeks = useMemo(() => {
    const weeks = [];
    const start = new Date(semesterStartDate);
    const end = new Date(semesterEndDate);
    
    let currentWeek = 1;
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
      weeks.push(currentWeek);
      currentWeek++;
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return weeks;
  }, [semesterStartDate, semesterEndDate]);

  // Day names for checkboxes
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleAddSlot = () => {
    if (timeSlots.length >= 5) return;
    const newSlot = { 
      fromHour: 8, 
      fromMinute: 0, 
      toHour: 9, 
      toMinute: 0, 
      fromDate: timeSlots[0].fromDate,
      toDate: timeSlots[0].toDate
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const handleTimeChange = (index: number, field: keyof ComplexTimeSlot, value: number | string) => {
    const newSlots = [...timeSlots];
    (newSlots[index] as any)[field] = typeof value === 'string' ? value : Number(value);
    setTimeSlots(newSlots);
    setError(null);
  };

  const handleRemoveSlot = (index: number) => {
    if (timeSlots.length <= 1) return;
    const newSlots = [...timeSlots];
    newSlots.splice(index, 1);
    setTimeSlots(newSlots);
  };

  const validateSlot = (slot: ComplexTimeSlot): boolean => {
    const fromTotal = slot.fromHour * 60 + slot.fromMinute;
    const toTotal = slot.toHour * 60 + slot.toMinute;
    
    if (toTotal <= fromTotal) {
      setError(`Time slot ${timeSlots.indexOf(slot) + 1}: End time must be after start time`);
      return false;
    }

    if (new Date(slot.toDate) < new Date(slot.fromDate)) {
      setError(`Time slot ${timeSlots.indexOf(slot) + 1}: End date must be after or equal to start date`);
      return false;
    }

    return true;
  };

  const validateRecurringSlot = (): boolean => {
    if (recurringSlot.daysOfWeek.length === 0) {
      setError("Please select at least one day of the week");
      return false;
    }

    if (recurringSlot.weeks.length === 0) {
      setError("Please select at least one week");
      return false;
    }

    const startTotal = recurringSlot.startHour * 60 + recurringSlot.startMinute;
    const endTotal = recurringSlot.endHour * 60 + recurringSlot.endMinute;
    
    if (endTotal <= startTotal) {
      setError("End time must be after start time");
      return false;
    }

    return true;
  };

  const checkForConflicts = (slot: ComplexTimeSlot): {hasConflict: boolean, conflictMessage: string} => {
    const conflicts = [];
    const fromDate = new Date(slot.fromDate);
    const toDate = new Date(slot.toDate);
    
    for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const slotStart = slot.fromHour * 60 + slot.fromMinute;
      const slotEnd = slot.toHour * 60 + slot.toMinute;
      
      const dayReservations = existingReservations.filter(r => r.day === dateStr && r.status !== 'Odrzucona');
      for (const res of dayReservations) {
        const resStart = res.startHour * 60 + res.startMinute;
        const resEnd = res.endHour * 60 + res.endMinute;
        
        if ((slotStart >= resStart && slotStart < resEnd) || 
            (slotEnd > resStart && slotEnd <= resEnd) ||
            (slotStart <= resStart && slotEnd >= resEnd)) {
          conflicts.push({
            date: dateStr,
            time: `${res.startHour}:${res.startMinute.toString().padStart(2, '0')} - ${res.endHour}:${res.endMinute.toString().padStart(2, '0')}`,
            title: res.title
          });
        }
      }
    }

    if (conflicts.length > 0) {
      const conflictMessages = conflicts.map(c => 
        `On ${c.date} at ${c.time} (${c.title})`
      ).join("\n");
      return {
        hasConflict: true,
        conflictMessage: `Time slot ${timeSlots.indexOf(slot) + 1} has conflicts:\n${conflictMessages}`
      };
    }
    
    return {hasConflict: false, conflictMessage: ''};
  };

  const checkRecurringConflicts = (): {hasConflict: boolean, conflictMessage: string} => {
    const conflicts = [];
    
    // Calculate all dates that would be reserved
    const reservedDates: {date: string, start: number, end: number}[] = [];
    
    for (const week of recurringSlot.weeks) {
      const weekStartDate = new Date(semesterStartDate);
      weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
      
      for (const dayOfWeek of recurringSlot.daysOfWeek) {
        const reservationDate = new Date(weekStartDate);
        reservationDate.setDate(reservationDate.getDate() + dayOfWeek);
        
        if (reservationDate > semesterEndDate) continue;
        
        const dateStr = reservationDate.toISOString().split('T')[0];
        reservedDates.push({
          date: dateStr,
          start: recurringSlot.startHour * 60 + recurringSlot.startMinute,
          end: recurringSlot.endHour * 60 + recurringSlot.endMinute
        });
      }
    }
    
    // Check each date for conflicts
    for (const {date, start, end} of reservedDates) {
      const dayReservations = existingReservations.filter(r => r.day === date && r.status !== 'Odrzucona');
      
      for (const res of dayReservations) {
        const resStart = res.startHour * 60 + res.startMinute;
        const resEnd = res.endHour * 60 + res.endMinute;
        
        if ((start >= resStart && start < resEnd) || 
            (end > resStart && end <= resEnd) ||
            (start <= resStart && end >= resEnd)) {
          conflicts.push({
            date,
            time: `${res.startHour}:${res.startMinute.toString().padStart(2, '0')} - ${res.endHour}:${res.endMinute.toString().padStart(2, '0')}`,
            title: res.title
          });
        }
      }
    }
    
    if (conflicts.length > 0) {
      const conflictMessages = conflicts.map(c => 
        `On ${c.date} at ${c.time} (${c.title})`
      ).join("\n");
      return {
        hasConflict: true,
        conflictMessage: `Recurring reservation has conflicts:\n${conflictMessages}`
      };
    }
    
    return {hasConflict: false, conflictMessage: ''};
  };

  const handleSubmit = async () => {
    if (!title) {
      setError("Please enter a title for the reservation");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "single") {
        // Validate all slots first
        for (const slot of timeSlots) {
          if (!validateSlot(slot)) return;
        }

        // Check for conflicts
        const allConflicts: string[] = [];
        for (const slot of timeSlots) {
          const {hasConflict, conflictMessage} = checkForConflicts(slot);
          if (hasConflict) {
            allConflicts.push(conflictMessage);
          }
        }

        if (allConflicts.length > 0) {
          setError(allConflicts.join("\n\n"));
          return;
        }

        await onSubmit(timeSlots, title);
      } else {
        if (!validateRecurringSlot()) return;
        
        const {hasConflict, conflictMessage} = checkRecurringConflicts();
        if (hasConflict) {
          setError(conflictMessage);
          return;
        }
        
        await onSubmitRecurring({
          ...recurringSlot,
          title
        });
      }
      
      setSuccess("Reservation successfully created!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to create reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDayOfWeek = (day: number) => {
    setRecurringSlot(prev => {
      const newDays = prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day];
      return {...prev, daysOfWeek: newDays};
    });
    setError(null);
  };

  const toggleWeek = (week: number) => {
    setRecurringSlot(prev => {
      const newWeeks = prev.weeks.includes(week)
        ? prev.weeks.filter(w => w !== week)
        : [...prev.weeks, week];
      return {...prev, weeks: newWeeks};
    });
    setError(null);
  };

  const toggleAllWeeks = (selectAll: boolean) => {
    setRecurringSlot(prev => ({
      ...prev,
      weeks: selectAll ? [...availableWeeks] : []
    }));
    setError(null);
  };

  return (
    <div className="modal-overlay">
      <div className="reservation-form-difficult">
        <h3>Add Complex Reservation</h3>
        
        <div className="mode-switch">
          <button
            className={mode === "single" ? "active" : ""}
            onClick={() => setMode("single")}
          >
            One-time/Multiple
          </button>
          <button
            className={mode === "recurring" ? "active" : ""}
            onClick={() => setMode("recurring")}
          >
            Recurring
          </button>
        </div>
        
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter reservation title"
          />
        </div>

        {mode === "single" ? (
          <>
            {timeSlots.map((slot, index) => (
              <div key={index} className="time-slot-group">
                <div className="time-slot-header">
                  <h4>Time Slot {index + 1}</h4>
                  {index > 0 && (
                    <button 
                      type="button"
                      className="remove-slot-btn"
                      onClick={() => handleRemoveSlot(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="time-range-group">
                  <div className="form-group">
                    <label>Start Time:</label>
                    <div className="time-inputs">
                      <select
                        value={slot.fromHour}
                        onChange={(e) => handleTimeChange(index, 'fromHour', parseInt(e.target.value))}
                      >
                        {Array.from({length: 24}, (_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      :
                      <select
                        value={slot.fromMinute}
                        onChange={(e) => handleTimeChange(index, 'fromMinute', parseInt(e.target.value))}
                      >
                        <option value={0}>00</option>
                        <option value={15}>15</option>
                        <option value={30}>30</option>
                        <option value={45}>45</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>End Time:</label>
                    <div className="time-inputs">
                      <select
                        value={slot.toHour}
                        onChange={(e) => handleTimeChange(index, 'toHour', parseInt(e.target.value))}
                      >
                        {Array.from({length: 24}, (_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      :
                      <select
                        value={slot.toMinute}
                        onChange={(e) => handleTimeChange(index, 'toMinute', parseInt(e.target.value))}
                      >
                        <option value={0}>00</option>
                        <option value={15}>15</option>
                        <option value={30}>30</option>
                        <option value={45}>45</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="date-range-group">
                  <div className="form-group">
                    <label>Start Date:</label>
                    <input
                      type="date"
                      value={slot.fromDate}
                      onChange={(e) => handleTimeChange(index, 'fromDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date:</label>
                    <input
                      type="date"
                      value={slot.toDate}
                      onChange={(e) => handleTimeChange(index, 'toDate', e.target.value)}
                      min={slot.fromDate}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button" 
              className="add-slot-btn"
              onClick={handleAddSlot}
              disabled={timeSlots.length >= 5}
            >
              + Add Another Time Slot (Max 5)
            </button>
          </>
        ) : (
          <div className="recurring-form">
            <div className="time-range-group compact">
              <div className="form-group">
                <label>Time:</label>
                <div className="time-inputs">
                  <select
                    value={recurringSlot.startHour}
                    onChange={(e) => setRecurringSlot({...recurringSlot, startHour: parseInt(e.target.value)})}
                  >
                    {Array.from({length: 24}, (_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  :
                  <select
                    value={recurringSlot.startMinute}
                    onChange={(e) => setRecurringSlot({...recurringSlot, startMinute: parseInt(e.target.value)})}
                  >
                    <option value={0}>00</option>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={45}>45</option>
                  </select>
                  &nbsp;to&nbsp;
                  <select
                    value={recurringSlot.endHour}
                    onChange={(e) => setRecurringSlot({...recurringSlot, endHour: parseInt(e.target.value)})}
                  >
                    {Array.from({length: 24}, (_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  :
                  <select
                    value={recurringSlot.endMinute}
                    onChange={(e) => setRecurringSlot({...recurringSlot, endMinute: parseInt(e.target.value)})}
                  >
                    <option value={0}>00</option>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={45}>45</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Repeat on:</label>
              <div className="days-checkboxes compact">
                {dayNames.map((day, index) => (
                  <label 
                    key={index} 
                    className={`day-checkbox ${recurringSlot.daysOfWeek.includes(index) ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={recurringSlot.daysOfWeek.includes(index)}
                      onChange={() => toggleDayOfWeek(index)}
                      hidden
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>For weeks:</label>
              <div className="weeks-selection compact">
                <div className="weeks-controls">
                  <button 
                    type="button" 
                    className="small-btn"
                    onClick={() => toggleAllWeeks(true)}
                  >
                    All
                  </button>
                  <button 
                    type="button" 
                    className="small-btn"
                    onClick={() => toggleAllWeeks(false)}
                  >
                    None
                  </button>
                </div>
                <div className="weeks-scroll-container">
                  <div className="weeks-checkboxes">
                    {availableWeeks.map(week => (
                      <label 
                        key={week} 
                        className={`week-checkbox ${recurringSlot.weeks.includes(week) ? 'active' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={recurringSlot.weeks.includes(week)}
                          onChange={() => toggleWeek(week)}
                          hidden
                        />
                        {week}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
        {success && <div className="success-message">{success}</div>}

        <div className="form-buttons">
          <button type="button" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : 
             mode === "single" ? "Reserve All Slots" : "Create Recurring Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReservationForDifficult;