import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "@styles/pages/ItemCalendar.css";
import type {Reservation,DayInfo,TimeSlot,SelectedSlot,User,RecurringReservation,ReservationForDifficultProps,ComplexTimeSlot} from "../types/authTypes";
import ReservationForDifficult from "../components/ui/kalendarz/ReservationForDifficult";
import ReservationForm from "../components/ui/kalendarz/ReservationForm";
import ReservationDetails from "../components/ui/kalendarz/ReservationDetails";

// Simulate API call for reservation approval
const submitReservationForApproval = async (reservation: Reservation): Promise<boolean> => {
  console.log("Submitting reservation for approval:", reservation);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const randomApproval = false;
  return randomApproval;
};

const submitReservationsForApproval = async (reservations: Reservation[]): Promise<boolean> => {
  console.log("Submitting multiple reservations for approval:", reservations);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const randomApproval = Math.random() > 0.3;
  return randomApproval;
};

const parseDateString = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateToDisplay = (date: Date): string => {
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateToKey = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const ItemCalendar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [daysPerPage, setDaysPerPage] = useState<number>(7);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [displayMode, setDisplayMode] = useState<"reserved" | "available">("reserved");
  const [page, setPage] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<DayInfo | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [addingForm, setAddingForm] = useState(false);
  const {  role, username } = useAuth();
  
  const startHour = 8;
  const endHour = 21;
  const slotDuration = 15;
  const slotHeight = 20;

  const [currentUser] = useState<User>({
    id: username as string,
    name: username as string,
    role: role
  });

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      day: "12.05.2025",
      startHour: 9,
      startMinute: 0,
      endHour: 11,
      endMinute: 0,
      title: "Morning Meeting",
      reservedBy: "John Doe",
      userId: "test",
      userName: "John Doe",
      status: "W trakcie"
    },
    {
      day: "12.05.2025",
      startHour: 11,
      startMinute: 0,
      endHour: 12,
      endMinute: 0,
      title: "Follow-up Discussion",
      reservedBy: "Jane Smith",
      userId: "Jane Smith",
      userName: "Jane Smith",
      status: "W trakcie"
    },
    {
      day: "12.05.2025",
      startHour: 14,
      startMinute: 0,
      endHour: 16,
      endMinute: 0,
      title: "Client Call",
      reservedBy: "John Doe",
      userId: "John Doe",
      userName: "John Doe",
      status: "W trakcie"
    },
    {
      day: "13.05.2025",
      startHour: 10,
      startMinute: 0,
      endHour: 12,
      endMinute: 0,
      title: "Project Review",
      reservedBy: "Team",
      userId: "Team",
      userName: "Team",
      status: "W trakcie"
    },
    {
      day: "14.05.2025",
      startHour: 13,
      startMinute: 0,
      endHour: 15,
      endMinute: 0,
      title: "Team Workshop",
      reservedBy: "Manager",
      userId: "Manager",
      userName: "Manager",
      status: "Brak akceptacji"
    },
    {
      day: "15.05.2025",
      startHour: 9,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
      title: "All Day Event",
      reservedBy: "Company",
      userId: "Company",
      userName: "Company",
      status: "Brak akceptacji"
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
        date: formatDateToKey(currentDay),
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
    return currentDate.toLocaleString('pl-PL', { 
      month: 'long', 
      year: 'numeric',
      timeZone: 'Europe/Warsaw'
    });
  };
  
  const getWeekRangeString = (): string => {
    const start = parseDateString(daysOfWeek[0].date);
    const end = parseDateString(daysOfWeek[6].date);
    
    const startDay = start.getDate();
    const startMonth = start.toLocaleDateString('pl-PL', { month: 'long' });
    const startYear = start.getFullYear();
    
    const endDay = end.getDate();
    const endMonth = end.toLocaleDateString('pl-PL', { month: 'long' });
    
    if (startMonth === endMonth) {
      return `${startDay}-${endDay} ${startMonth} ${startYear}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }
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
    const dayReservations = reservations.filter(r => 
      r.day === day && 
      r.status !== 'Odrzucona' && 
      r.status !== 'Zakonczona'
    );
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
         (current.reservation && slot.reservation && current.reservation.userId === slot.reservation.userId))
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
        
        const statusClass = slot.reserved ? 
          (slot.reservation?.status === 'Brak akceptacji' ? 'pending' : 
           slot.reservation?.status === 'W trakcie' ? 'approved' : 
           slot.reservation?.status === 'Odrzucona' ? 'rejected' : 
           slot.reservation?.status === 'Zakonczona' ? 'completed' : '') : '';
        
        return (
          <div 
            key={index}
            className={`timeBlock ${slot.reserved ? 'reserved' : 'available'} ${statusClass}`}
            style={{
              top: `${topPosition}px`,
              height: `${height}px`
            }}
            onClick={() => {
              if (slot.reserved) {
                const reservation = reservations.find(r => 
                  r.day === day && 
                  r.startHour === slot.startHour && 
                  r.startMinute === slot.startMinute
                );
                if (reservation) setSelectedReservation(reservation);
              } else {
                setSelectedSlot({ 
                  startHour: slot.startHour,
                  startMinute: slot.startMinute,
                  day,
                  availableStartHour: slot.startHour,
                  availableStartMinute: slot.startMinute,
                  availableEndHour: slot.endHour,
                  availableEndMinute: slot.endMinute
                });
              }
            }}
          >
            {slot.reserved ? (
              <div className="reservationContent">
                <div className="reservationTitle">{slot.reservation?.title || 'Reserved'}</div>
                <div className="reservationTime">
                  {slot.startHour}:{slot.startMinute.toString().padStart(2, '0')} - {slot.endHour}:{slot.endMinute.toString().padStart(2, '0')}
                </div>
                <div className="reservationUser">{slot.reservation?.userName}</div>
                {slot.reservation?.status && (
                  <div className={`statusBadge ${statusClass}`}>
                    {slot.reservation.status}
                  </div>
                )}
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

  const handleAddButtonClick = () => {
    if (viewMode === "day" && currentDay) {
      const slots = getAvailableSlots(currentDay.date);
      const availableSlot = slots.find(slot => !slot.reserved);
      
      if (availableSlot) {
        setSelectedSlot({ 
          startHour: availableSlot.startHour, 
          startMinute: availableSlot.startMinute,
          day: currentDay.date,
          availableStartHour: availableSlot.startHour,
          availableStartMinute: availableSlot.startMinute,
          availableEndHour: availableSlot.endHour,
          availableEndMinute: availableSlot.endMinute
        });
      }
    }
  };

  const handleAddReservation = async (reservation: Reservation) => {
    try {
      if (currentUser.role === 'user') {
        const isApproved = await submitReservationForApproval(reservation);
        
        const newReservation: Reservation = {
          ...reservation,
          status: isApproved ? 'W trakcie' : 'Brak akceptacji'
        };
        
        setReservations([...reservations, newReservation]);
        setSelectedSlot(null);
      } else {
        setReservations([...reservations, {...reservation, status: 'W trakcie'}]);
        setSelectedSlot(null);
      }
    } catch (err) {
      console.error("Failed to add reservation:", err);
    }
  };

  const handleDeleteReservation = async () => {
    if (!selectedReservation) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setReservations(reservations.filter(r => r !== selectedReservation));
      setSelectedReservation(null);
    } catch (err) {
      console.error("Failed to delete reservation:", err);
      throw err;
    }
  };

  const [semesterStartDate] = useState<Date>(parseDateString('01.06.2025'));
const [semesterEndDate] = useState<Date>(parseDateString('31.08.2025'));

  const handleAddComplexReservation = async (slots: ComplexTimeSlot[], title: string) => {
    try {
      let newReservations: Reservation[] = [];
      
      for (const slot of slots) {
        const fromDate = parseDateString(slot.fromDate);
        const toDate = parseDateString(slot.toDate);
        
        for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
          const dateStr = formatDateToKey(d);
          
          newReservations.push({
            day: dateStr,
            startHour: slot.fromHour,
            startMinute: slot.fromMinute,
            endHour: slot.toHour,
            endMinute: slot.toMinute,
            title: title,
            reservedBy: currentUser.name,
            userId: currentUser.id,
            userName: currentUser.name,
            status: currentUser.role === 'user' ? 'Brak akceptacji' : 'W trakcie'
          });
        }
      }
      
      if (currentUser.role === 'user') {
        const isApproved = await submitReservationsForApproval(newReservations);
        
        newReservations = newReservations.map(r => ({
          ...r,
          status: isApproved ? 'W trakcie' : 'Brak akceptacji'
        }));
      }
      
      setReservations([...reservations, ...newReservations]);
    } catch (err) {
      console.error("Failed to add complex reservation:", err);
      throw err;
    }
  };

  const handleAddRecurringReservation = async (reservation: RecurringReservation) => {
    try {
      let newReservations: Reservation[] = [];
      
      for (const week of reservation.weeks) {
        const weekStartDate = new Date(semesterStartDate);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
        
        for (const dayOfWeek of reservation.daysOfWeek) {
          const reservationDate = new Date(weekStartDate);
          reservationDate.setDate(reservationDate.getDate() + dayOfWeek);
          
          if (reservationDate > semesterEndDate) continue;
          
          const dateStr = formatDateToKey(reservationDate);
          
          newReservations.push({
            day: dateStr,
            startHour: reservation.startHour,
            startMinute: reservation.startMinute,
            endHour: reservation.endHour,
            endMinute: reservation.endMinute,
            title: reservation.title,
            reservedBy: currentUser.name,
            userId: currentUser.id,
            userName: currentUser.name,
            status: currentUser.role === 'user' ? 'Brak akceptacji' : 'W trakcie'
          });
        }
      }
      
      if (currentUser.role === 'user') {
        const isApproved = await submitReservationsForApproval(newReservations);
        
        newReservations = newReservations.map(r => ({
          ...r,
          status: isApproved ? 'W trakcie' : 'Brak akceptacji'
        }));
      }
      
      setReservations([...reservations, ...newReservations]);
    } catch (err) {
      console.error("Failed to add recurring reservation:", err);
      throw err;
    }
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
      <div className="calendarName">
        <p className="itemName">{}VR Headset</p>
        <div className="breadcrumpsRes">
          Raptors - Urządzenia -Mikrokontrolery
        </div>
      </div>
      <div className="calendarTopControls">
        <button className="button_today" onClick={goToToday}>Dzisiaj</button>
        <div className="dateNavigation">
          <button onClick={() => changeDate("prev")}>&lt;</button>
          <span className="dateRange">
            {viewMode === "week" ? getWeekRangeString() : 
             currentDay && formatDateToDisplay(parseDateString(currentDay.date))}
          </span>
          <button onClick={() => changeDate("next")}>&gt;</button>
        </div>
        <div className="monthYear">{getCurrentMonthYear()}</div>
        <div className="viewModeControls">
          <button 
            className={viewMode === "week" ? "active" : ""}
            onClick={() => handleViewModeChange("week")}
          >
            Tydzień
          </button>
          <button 
            className={viewMode === "day" ? "active" : ""}
            onClick={() => handleViewModeChange("day")}
          >
            Dzień
          </button>
        </div>
        <select
        className="CalendarSelect"
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value as "reserved" | "available")}
        >
          <option value="reserved">Zarezerwowane</option>
          <option value="available">Dostępne</option>
        </select>
      </div>

      <div className="calendarGrid">
        <div className="calendarTimeHeader">
          <button className="addBtn" onClick={handleAddButtonClick}>+</button>
          <button 
            className="addComplexBtn"
            onClick={() => setAddingForm(true)}
          >
            + Złożona rezerwacja
          </button>
        </div>

        {viewMode === "week" ? (
          <>
            <div className="calendarDayHeaders">
              {visibleDays.map((day) => (
                <div className="dayHeader" key={day.date}>
                  <div>{day.label}</div>
                  <div>{parseDateString(day.date).getDate()}</div>
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
                <div>{currentDay && formatDateToDisplay(parseDateString(currentDay.date))}</div>
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
          currentUser={currentUser}
        />
      )}

      {selectedReservation && (
        <ReservationDetails
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onDelete={handleDeleteReservation}
          currentUser={currentUser}
        />
      )}

      {addingForm && (
        <ReservationForDifficult
          onClose={() => setAddingForm(false)}
          onSubmit={handleAddComplexReservation}
          onSubmitRecurring={handleAddRecurringReservation}
          currentUser={currentUser}
          existingReservations={reservations}
          semesterStartDate={semesterStartDate}
          semesterEndDate={semesterEndDate}
        />
      )}
    </div>
  );
};

export default ItemCalendar;