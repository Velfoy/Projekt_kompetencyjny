export type UserRole = 'admin' | 'user' | null;

export interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
  username: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
export interface DaySchedule {
  day: string;
  from: string;
  to: string;
}



export interface Reservation {
  id: number,
  day: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  title: string;
  userName: string;
  status?: 'Brak akceptacji' | 'W trakcie' | 'Zakonczona' | 'Odrzucona'; // Updated status field
}

export interface DayInfo {
  label: string;
  date: string;
  dateObj: Date;
}

export interface TimeSlot {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  reserved: boolean;
  reservation?: Reservation;
}

export interface SelectedSlot {
  startHour: number;
  startMinute: number;
  day: string;
  availableStartHour?: number;
  availableStartMinute?: number;
  availableEndHour?: number;
  availableEndMinute?: number;
}

export interface User {
  name: string;
  role: 'user' | 'admin'|null; // Added role field
}

export interface RecurringReservation {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  weeks: number[]; // Week numbers (1-15 typically)
  title: string;
}
export interface ReservationForDifficultProps {
  onClose: () => void;
  onSubmit: (slots: ComplexTimeSlot[], title: string) => Promise<void>;
  onSubmitRecurring: (reservation: RecurringReservation) => Promise<void>;
  currentUser: User;
  existingReservations: Reservation[];
  semesterStartDate: Date;
  semesterEndDate: Date;
  setSuccess?: (message: string | null) => void; // Add this
}
export interface ComplexTimeSlot {
  fromHour: number;
  fromMinute: number;
  toHour: number;
  toMinute: number;
  fromDate: string;
  toDate: string;
}