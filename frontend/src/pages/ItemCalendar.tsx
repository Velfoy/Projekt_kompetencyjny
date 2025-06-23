import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@styles/pages/ItemCalendar.css";

interface Reservation {
  day: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  title: string;
  reservedBy: string;
}

interface DayInfo {
  label: string;
  date: string;
  dateObj: Date;
}

interface TimeSlot {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  reserved: boolean;
  reservation?: Reservation;
}

// Reservation Form Component
const ReservationForm: React.FC<{
  selectedSlot: { startHour: number; startMinute: number; day: string } | null;
  onClose: () => void;
  onSubmit: (reservation: Reservation) => void;
}> = ({ selectedSlot, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [reservedBy, setReservedBy] = useState("");
  const [endHour, setEndHour] = useState(selectedSlot?.startHour || 0);
  const [endMinute, setEndMinute] = useState((selectedSlot?.startMinute || 0) + 30);

  useEffect(() => {
    if (selectedSlot) {
      setEndHour(selectedSlot.startHour);
      setEndMinute(selectedSlot.startMinute + 30);
    }
  }, [selectedSlot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    
    onSubmit({
      title,
      reservedBy,
      startHour: selectedSlot.startHour,
      startMinute: selectedSlot.startMinute,
      endHour,
      endMinute,
      day: selectedSlot.day
    });
    onClose();
  };

  if (!selectedSlot) return null;

  return (
    <div className="modal-overlay">
      <div className="reservation-form">
        <h3>Add Reservation</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Reserved By:</label>
            <input
              type="text"
              value={reservedBy}
              onChange={(e) => setReservedBy(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Time:</label>
            <div className="time-display">
              {selectedSlot.startHour}:{selectedSlot.startMinute.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="form-group">
            <label>End Time:</label>
            <div className="time-inputs">
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
              :
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(Number(e.target.value))}
              >
                <option value={0}>00</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
              </select>
            </div>
          </div>
          <div className="form-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reservation Details Component
const ReservationDetails: React.FC<{
  reservation: Reservation | null;
  onClose: () => void;
  onDelete: () => void;
}> = ({ reservation, onClose, onDelete }) => {
  if (!reservation) return null;

  return (
    <div className="modal-overlay">
      <div className="reservation-details">
        <h3>Reservation Details</h3>
        <div className="details-content">
          <p><strong>Title:</strong> {reservation.title}</p>
          <p><strong>Reserved By:</strong> {reservation.reservedBy}</p>
          <p><strong>Date:</strong> {new Date(reservation.day).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {reservation.startHour}:{reservation.startMinute.toString().padStart(2, '0')} - {reservation.endHour}:{reservation.endMinute.toString().padStart(2, '0')}</p>
        </div>
        <div className="details-buttons">
          <button onClick={onDelete} className="delete-btn">Delete</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const ItemCalendar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [daysPerPage, setDaysPerPage] = useState<number>(7);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [displayMode, setDisplayMode] = useState<"reserved" | "available">("reserved");
  const [page, setPage] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<DayInfo | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ startHour: number; startMinute: number; day: string } | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  
  const startHour = 8;
  const endHour = 21;
  const slotDuration = 30;
  const slotHeight = 20;

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      day: "2025-05-12",
      startHour: 9,
      startMinute: 0,
      endHour: 11,
      endMinute: 0,
      title: "Morning Meeting",
      reservedBy: "John Doe"
    },
    {
      day: "2025-05-12",
      startHour: 11,
      startMinute: 0,
      endHour: 12,
      endMinute: 0,
      title: "Follow-up Discussion",
      reservedBy: "Jane Smith"
    },
    {
      day: "2025-05-12",
      startHour: 14,
      startMinute: 0,
      endHour: 16,
      endMinute: 0,
      title: "Client Call",
      reservedBy: "John Doe"
    },
    {
      day: "2025-05-13",
      startHour: 10,
      startMinute: 0,
      endHour: 12,
      endMinute: 0,
      title: "Project Review",
      reservedBy: "Team"
    },
    {
      day: "2025-05-14",
      startHour: 13,
      startMinute: 0,
      endHour: 15,
      endMinute: 0,
      title: "Team Workshop",
      reservedBy: "Manager"
    },
    {
      day: "2025-05-15",
      startHour: 9,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
      title: "All Day Event",
      reservedBy: "Company"
    },
  ]);

  const generateDaysOfWeek = (date: Date): DayInfo[] => {
    const days: DayInfo[] = [];
    const dayOfWeek = date.getDay();
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const dayLabels = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      days.push({
        label: dayLabels[currentDay.getDay()],
        date: currentDay.toISOString().split('T')[0],
        dateObj: currentDay
      });
    }
    
    return days;
  };

  const [daysOfWeek, setDaysOfWeek] = useState<DayInfo[]>(generateDaysOfWeek(currentDate));

  useEffect(() => {
    const handleResize = () => {
      if (viewMode === "week") {
        const w = window.innerWidth;
        if (w < 500) setDaysPerPage(1);
        else if (w < 600) setDaysPerPage(2);
        else if (w < 900) setDaysPerPage(3);
        else if (w < 1200) setDaysPerPage(4);
        else if (w < 1290) setDaysPerPage(5);
        else if (w < 1400) setDaysPerPage(6);
        else setDaysPerPage(7);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

  useEffect(() => {
    const newDays = generateDaysOfWeek(currentDate);
    setDaysOfWeek(newDays);
    if (viewMode === "day") {
      setCurrentDay(newDays.find(day => 
        day.dateObj.toDateString() === currentDate.toDateString()
      ) || newDays[0]);
    } else {
      setPage(0);
    }
  }, [currentDate, viewMode]);

  const totalPages = Math.ceil(daysOfWeek.length / daysPerPage);
  const visibleDays = daysOfWeek.slice(page * daysPerPage, (page + 1) * daysPerPage);

  const getCurrentMonthYear = (): string => {
    return currentDate.toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
  };

  const getWeekRangeString = (): string => {
    const start = new Date(daysOfWeek[0].date);
    const end = new Date(daysOfWeek[6].date);
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleString('pl-PL', { month: 'long' })} ${start.getFullYear()}`;
  };

  const changeDate = (direction: "prev" | "next"): void => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -1 : 1));
      const newDays = generateDaysOfWeek(newDate);
      setCurrentDay(newDays.find(day => 
        day.dateObj.toDateString() === newDate.toDateString()
      ) || newDays[0]);
    }
    setCurrentDate(newDate);
  };

  const goToToday = (): void => {
    const today = new Date();
    setCurrentDate(today);
    if (viewMode === "day") {
      const newDays = generateDaysOfWeek(today);
      setCurrentDay(newDays.find(day => 
        day.dateObj.toDateString() === today.toDateString()
      ) || newDays[0]);
    }
  };

  const generateTimeSlots = (): { hour: number; minute: number }[] => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        slots.push({ hour, minute });
      }
    }
    return slots;
  };

  const mergeAdjacentReservations = (reservations: Reservation[]): Reservation[] => {
    if (reservations.length === 0) return [];
    
    const sorted = [...reservations].sort((a, b) => 
      (a.startHour * 60 + a.startMinute) - (b.startHour * 60 + b.startMinute)
    );
    
    const merged: Reservation[] = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
      const last = merged[merged.length - 1];
      const current = sorted[i];
      
      if (last.endHour === current.startHour && last.endMinute === current.startMinute) {
        last.endHour = current.endHour;
        last.endMinute = current.endMinute;
        last.title = last.title.includes(current.title) ? last.title : `${last.title}, ${current.title}`;
      } else {
        merged.push(current);
      }
    }
    
    return merged;
  };

  const getAvailableSlots = (day: string): TimeSlot[] => {
    const dayReservations = reservations.filter(r => r.day === day);
    const mergedReservations = mergeAdjacentReservations(dayReservations);
    const allSlots: TimeSlot[] = generateTimeSlots().map(slot => {
      const endMinute = slot.minute + slotDuration;
      const endHour = endMinute >= 60 ? slot.hour + 1 : slot.hour;
      const adjustedEndMinute = endMinute >= 60 ? endMinute - 60 : endMinute;
      
      return {
        startHour: slot.hour,
        startMinute: slot.minute,
        endHour,
        endMinute: adjustedEndMinute,
        reserved: false
      };
    });

    mergedReservations.forEach(res => {
      const resStart = res.startHour * 60 + res.startMinute;
      const resEnd = res.endHour * 60 + res.endMinute;
      
      allSlots.forEach(slot => {
        const slotStart = slot.startHour * 60 + slot.startMinute;
        const slotEnd = slot.endHour * 60 + slot.endMinute;
        
        if (resStart <= slotStart && resEnd >= slotEnd) {
          slot.reserved = true;
          slot.reservation = res;
        }
      });
    });
    
    return allSlots;
  };

  const mergeAdjacentSlots = (slots: TimeSlot[]): TimeSlot[] => {
    const merged: TimeSlot[] = [];
    let current: TimeSlot | null = null;

    slots.forEach(slot => {
      if (current === null) {
        current = { ...slot };
      } else if (
        current.reserved === slot.reserved &&
        current.endHour === slot.startHour && 
        current.endMinute === slot.startMinute &&
        (current.reserved === false || 
         (current.reservation && slot.reservation && current.reservation.title === slot.reservation.title))
      ) {
        current.endHour = slot.endHour;
        current.endMinute = slot.endMinute;
      } else {
        merged.push(current);
        current = { ...slot };
      }
    });

    if (current !== null) {
      merged.push(current);
    }

    return merged;
  };

  const renderTimeBlocks = (day: string) => {
    const slots = getAvailableSlots(day);
    const mergedSlots = mergeAdjacentSlots(slots);
    
    return mergedSlots.map((slot, index) => {
      if ((displayMode === "reserved" && slot.reserved) || 
          (displayMode === "available" && !slot.reserved)) {
        const startMinutes = (slot.startHour - startHour) * 60 + slot.startMinute;
        const endMinutes = (slot.endHour - startHour) * 60 + slot.endMinute;
        const durationMinutes = endMinutes - startMinutes;
        
        const topPosition = startMinutes * (slotHeight / 30);
        const height = durationMinutes * (slotHeight / 30);
        
        return (
          <div 
            key={index}
            className={`timeBlock ${slot.reserved ? 'reserved' : 'available'}`}
            style={{
              top: `${topPosition}px`,
              height: `${height}px`
            }}
            onClick={() => handleSlotClick(day, {
              startHour: slot.startHour,
              startMinute: slot.startMinute
            })}
          >
            {slot.reserved ? (
              <div className="reservationContent">
                <div className="reservationTitle">{slot.reservation?.title || 'Reserved'}</div>
                <div className="reservationTime">
                  {slot.startHour}:{slot.startMinute.toString().padStart(2, '0')} - {slot.endHour}:{slot.endMinute.toString().padStart(2, '0')}
                </div>
              </div>
            ) : (
              'Available'
            )}
          </div>
        );
      }
      return null;
    });
  };

  const handleSlotClick = (day: string, slot: { startHour: number; startMinute: number }) => {
    const reservation = reservations.find(r => 
      r.day === day && 
      r.startHour === slot.startHour && 
      r.startMinute === slot.startMinute
    );
    
    if (reservation) {
      setSelectedReservation(reservation);
    } else {
      setSelectedSlot({ ...slot, day });
    }
  };

  const handleAddButtonClick = () => {
    if (viewMode === "day" && currentDay) {
      setSelectedSlot({ 
        startHour: startHour, 
        startMinute: 0,
        day: currentDay.date 
      });
    } else {
      // In week view, user needs to click a specific time slot
      // So we don't automatically show the form
    }
  };

  const handleAddReservation = (reservation: Reservation) => {
    setReservations([...reservations, reservation]);
  };

  const handleDeleteReservation = () => {
    if (!selectedReservation) return;
    setReservations(reservations.filter(r => r !== selectedReservation));
    setSelectedReservation(null);
  };

  const handleViewModeChange = (mode: "week" | "day") => {
    setViewMode(mode);
    if (mode === "day") {
      setCurrentDay(daysOfWeek.find(day => 
        day.dateObj.toDateString() === currentDate.toDateString()
      ) || daysOfWeek[0]);
    }
  };

  return (
    <div className="calendarWrapper">
      <div className="calendarTopControls">
        <button onClick={goToToday}>Today</button>
        <div className="dateNavigation">
          <button onClick={() => changeDate("prev")}>&lt;</button>
          <span className="dateRange">
            {viewMode === "week" ? getWeekRangeString() : 
             currentDay?.dateObj.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
          </span>
          <button onClick={() => changeDate("next")}>&gt;</button>
        </div>
        <div className="monthYear">{getCurrentMonthYear()}</div>
        <div className="viewModeControls">
          <button 
            className={viewMode === "week" ? "active" : ""}
            onClick={() => handleViewModeChange("week")}
          >
            Week
          </button>
          <button 
            className={viewMode === "day" ? "active" : ""}
            onClick={() => handleViewModeChange("day")}
          >
            Day
          </button>
        </div>
        <select
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value as "reserved" | "available")}
        >
          <option value="reserved">Reserved</option>
          <option value="available">Available</option>
        </select>
      </div>

      <div className="calendarGrid">
        <div className="calendarTimeHeader">
          <button className="addBtn" onClick={handleAddButtonClick}>+</button>
        </div>

        {viewMode === "week" ? (
          <>
            <div className="calendarDayHeaders">
              {visibleDays.map((day) => (
                <div className="dayHeader" key={day.date}>
                  <div>{day.label}</div>
                  <div>{day.dateObj.getDate()}</div>
                </div>
              ))}
            </div>

            <div className="calendarMain">
              <div className="calendarTimes">
                {[...Array(endHour - startHour)].map((_, i) => (
                  <div key={i} className="timeSlot">
                    {startHour + i}:00
                  </div>
                ))}
              </div>

              <div className="calendarSlider">
                {visibleDays.map((day) => (
                  <div className="calendarDayColumn" key={day.date}>
                    {renderTimeBlocks(day.date)}
                  </div>
                ))}
              </div>
            </div>

            <div className="sliderControls">
              {page > 0 && (
                <button className="sliderArrow left" onClick={() => setPage(page - 1)}>
                  &lt;
                </button>
              )}
              {page < totalPages - 1 && (
                <button className="sliderArrow right" onClick={() => setPage(page + 1)}>
                  &gt;
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="calendarDayHeaders">
              <div className="dayHeader">
                <div>{currentDay?.label}</div>
                <div>{currentDay?.dateObj.getDate()}</div>
              </div>
            </div>

            <div className="calendarMain">
              <div className="calendarTimes">
                {[...Array(endHour - startHour)].map((_, i) => (
                  <div key={i} className="timeSlot">
                    {startHour + i}:00
                  </div>
                ))}
              </div>

              <div className="calendarSlider">
                <div className="calendarDayColumn">
                  {currentDay && renderTimeBlocks(currentDay.date)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedSlot && (
        <ReservationForm
          selectedSlot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSubmit={handleAddReservation}
        />
      )}

      {selectedReservation && (
        <ReservationDetails
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onDelete={handleDeleteReservation}
        />
      )}
    </div>
  );
};

export default ItemCalendar;