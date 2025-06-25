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
  const formatDateToKey = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const [timeSlots, setTimeSlots] = useState<ComplexTimeSlot[]>([
    { 
      fromHour: 8, 
      fromMinute: 0, 
      toHour: 9, 
      toMinute: 0, 
      fromDate: formatDateToKey(new Date()),
      toDate: formatDateToKey(new Date())
    }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time boundaries
  const MIN_HOUR = 8;
  const MAX_HOUR = 21;

  // Helper functions for date handling
  const parseDateString = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

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
  const dayNames = ["Niedz", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];

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
    
    // Convert date from HTML input format (YYYY-MM-DD) to Polish format (DD.MM.YYYY)
    if ((field === 'fromDate' || field === 'toDate') && typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        value = formatDateToKey(date);
      }
    }
    
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
    
    // Check time boundaries
    if (slot.fromHour < MIN_HOUR || slot.fromHour > MAX_HOUR) {
      setError(`Time slot ${timeSlots.indexOf(slot) + 1}: Start time must be between 8:00 and 21:00`);
      return false;
    }
    
    if (slot.toHour < MIN_HOUR || slot.toHour > MAX_HOUR) {
      setError(`Time slot ${timeSlots.indexOf(slot) + 1}: End time must be between 8:00 and 21:00`);
      return false;
    }
    
    if (toTotal <= fromTotal) {
      setError(`Time slot ${timeSlots.indexOf(slot) + 1}: End time must be after start time`);
      return false;
    }

    if (parseDateString(slot.toDate) < parseDateString(slot.fromDate)) {
      setError(`Time slot ${timeSlots.indexOf(slot) + 1}: End date must be after or equal to start date`);
      return false;
    }

    return true;
  };

  const validateRecurringSlot = (): boolean => {
    if (recurringSlot.daysOfWeek.length === 0) {
      setError("Proszę wybrać przynajmniej jeden dzień tygodnia");
      return false;
    }

    if (recurringSlot.weeks.length === 0) {
      setError("Proszę wybrać przynajmniej jeden tydzień");
      return false;
    }

    const startTotal = recurringSlot.startHour * 60 + recurringSlot.startMinute;
    const endTotal = recurringSlot.endHour * 60 + recurringSlot.endMinute;
    
    // Check time boundaries
    if (recurringSlot.startHour < MIN_HOUR || recurringSlot.startHour > MAX_HOUR) {
      setError("Godzina rozpoczęcia musi być między 8:00 a 21:00");
      return false;
    }
    
    if (recurringSlot.endHour < MIN_HOUR || recurringSlot.endHour > MAX_HOUR) {
      setError("Godzina zakończenia musi być między 8:00 a 21:00");
      return false;
    }
    
    if (endTotal <= startTotal) {
      setError("Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia");
      return false;
    }

    return true;
  };

  const checkForConflicts = (slot: ComplexTimeSlot): {hasConflict: boolean, conflictMessage: string} => {
    const conflicts = [];
    const fromDate = parseDateString(slot.fromDate);
    const toDate = parseDateString(slot.toDate);
    
    for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDateToKey(d);
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
        `W dniu ${c.date} w godzinach ${c.time} (${c.title})`
      ).join("\n");
      return {
        hasConflict: true,
        conflictMessage: `Slot czasowy ${timeSlots.indexOf(slot) + 1} ma konflikty:\n${conflictMessages}`
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
        
        const dateStr = formatDateToKey(reservationDate);
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
        `W dniu ${c.date} w godzinach ${c.time} (${c.title})`
      ).join("\n");
      return {
        hasConflict: true,
        conflictMessage: `Powtarzająca się rezerwacja ma konflikty:\n${conflictMessages}`
      };
    }
    
    return {hasConflict: false, conflictMessage: ''};
  };

  const handleSubmit = async () => {
    if (!title) {
      setError("Proszę wprowadzić tytuł rezerwacji");
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
      
      setSuccess("Rezerwacja została pomyślnie utworzona!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Nie udało się utworzyć rezerwacji. Proszę spróbować ponownie.");
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

  // Generate hour options for time selectors (8:00-21:00)
  const hourOptions = Array.from({length: MAX_HOUR - MIN_HOUR + 1}, (_, i) => MIN_HOUR + i);

  return (
    <div className="modal-overlay">
      <div className="reservation-form-difficult">
        <h3>Dodaj złożoną rezerwację</h3>
        
        <div className="mode-switch">
          <button
            className={mode === "single" ? "active" : ""}
            onClick={() => setMode("single")}
          >
            Jednorazowa/Wielokrotna
          </button>
          <button
            className={mode === "recurring" ? "active" : ""}
            onClick={() => setMode("recurring")}
          >
            Powtarzająca się
          </button>
        </div>
        
        <div className="form-group">
          <label>Tytuł:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Wprowadź tytuł rezerwacji"
          />
        </div>

        {mode === "single" ? (
          <>
            {timeSlots.map((slot, index) => (
              <div key={index} className="time-slot-group">
                <div className="time-slot-header">
                  <h4>Slot czasowy {index + 1}</h4>
                  {index > 0 && (
                    <button 
                      type="button"
                      className="remove-slot-btn"
                      onClick={() => handleRemoveSlot(index)}
                    >
                      Usuń
                    </button>
                  )}
                </div>

                <div className="time-range-group">
                  <div className="form-group">
                    <label>Godzina rozpoczęcia:</label>
                    <div className="time-inputs">
                      <select
                        value={slot.fromHour}
                        onChange={(e) => handleTimeChange(index, 'fromHour', parseInt(e.target.value))}
                      >
                        {hourOptions.map(hour => (
                          <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
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
                    <label>Godzina zakończenia:</label>
                    <div className="time-inputs">
                      <select
                        value={slot.toHour}
                        onChange={(e) => handleTimeChange(index, 'toHour', parseInt(e.target.value))}
                      >
                        {hourOptions.map(hour => (
                          <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
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
                    <label>Data rozpoczęcia:</label>
                    <input
                      type="date"
                      value={new Date(parseDateString(slot.fromDate)).toISOString().split('T')[0]}
                      onChange={(e) => handleTimeChange(index, 'fromDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Data zakończenia:</label>
                    <input
                      type="date"
                      value={new Date(parseDateString(slot.toDate)).toISOString().split('T')[0]}
                      onChange={(e) => handleTimeChange(index, 'toDate', e.target.value)}
                      min={new Date(parseDateString(slot.fromDate)).toISOString().split('T')[0]}
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
              + Dodaj kolejny slot czasowy (Maks. 5)
            </button>
          </>
        ) : (
          <div className="recurring-form">
            <div className="time-range-group compact">
              <div className="form-group">
                <label>Godziny:</label>
                <div className="time-inputs">
                  <select
                    value={recurringSlot.startHour}
                    onChange={(e) => setRecurringSlot({...recurringSlot, startHour: parseInt(e.target.value)})}
                  >
                    {hourOptions.map(hour => (
                      <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
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
                  &nbsp;do&nbsp;
                  <select
                    value={recurringSlot.endHour}
                    onChange={(e) => setRecurringSlot({...recurringSlot, endHour: parseInt(e.target.value)})}
                  >
                    {hourOptions.map(hour => (
                      <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
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
              <label>Powtarzaj w:</label>
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
              <label>Dla tygodni:</label>
              <div className="weeks-selection compact">
                <div className="weeks-controls">
                  <button 
                    type="button" 
                    className="small-btn"
                    onClick={() => toggleAllWeeks(true)}
                  >
                    Wszystkie
                  </button>
                  <button 
                    type="button" 
                    className="small-btn"
                    onClick={() => toggleAllWeeks(false)}
                  >
                    Żaden
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
          <button type="button" onClick={onClose} disabled={isSubmitting}>Anuluj</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Przetwarzanie..." : 
             mode === "single" ? "Zarezerwuj wszystkie sloty" : "Utwórz powtarzającą się rezerwację"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationForDifficult;