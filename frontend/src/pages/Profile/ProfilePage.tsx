import { useAuth } from '@hooks/useAuth';
import { useEffect, useState } from 'react';
import styles from '@styles/pages/profile.module.css';
import ReservatioNow from '@/src/components/ui/Profile/ReservatioNow';
import ReservationDone from '@/src/components/ui/Profile/ReservationDone';
import NewItem from '@/src/components/ui/Profile/NewItem';
import NewUser from '@/src/components/ui/Profile/NewUser';
import NewPost from '@/src/components/ui/Profile/NewPost';
import type {DaySchedule} from '../../types/authTypes';
import { backend_url } from '@/src/main';

interface Reservation {
  id: number;
  title: string;
  description: string;
  timeLeft: string;
}

interface DoneReservation {
  id: number;
  title: string;
  description: string;
  completedAt: string;
}

const ProfilePage: React.FC = () => {
  const { isAuth, role, username } = useAuth();

  const [panelState, setPanelState] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'reserve_now' | 'reserve_done'>('reserve_now');
  const [activeTab2, setActiveTab2] = useState<'new_item' | 'users' | 'new_post'>('new_item');

  const initialReservations: Reservation[] = [
    { id: 1, title: "STM", description: "Dane rezerwacyjne do stm...", timeLeft: "20 minut" },
    { id: 2, title: "Microscope", description: "Szczegóły rezerwacji...", timeLeft: "10 minut" },
    { id: 3, title: "eter", description: "Rezerwacja spektrometru...", timeLeft: "30 minut" },
    { id: 4, title: "Micro", description: "Szczegóły rezerwacji...", timeLeft: "10 minut" },
    { id: 5, title: "Spectter", description: "Rezerwacja spektrometru...", timeLeft: "30 minut" },
  ];

  const initialDoneReservations: DoneReservation[] = [
    { id: 101, title: "AFM", description: "Rezerwacja zakończona...", completedAt: "2025-06-15 14:30" },
    { id: 102, title: "XRD", description: "Pomiar zakończony pomyślnie.", completedAt: "2025-06-14 09:15" },
    { id: 103, title: "KOLPss", description: "Pomiar zakończony.", completedAt: "2025-06-14 09:15" },
    { id: 104, title: "SEM", description: "Analiza próbki zakończona.", completedAt: "2025-06-13 10:00" },
     { id: 105, title: "Google", description: "Rezerwacja zakończona...", completedAt: "2025-06-15 14:30" },
  ];
  const mockTime:DaySchedule[]=[
  { day: '02.03.2025', from: '10:00', to: '12:00' },
  { day: '09.03.2025', from: '10:00', to: '12:00' },
  { day: '16.03.2025', from: '10:00', to: '12:00' },
  { day: '30.03.2025', from: '10:00', to: '12:00' },
]
const mockDifficulty:string="difficult";
  const mockTimeDone:DaySchedule[]=[
  { day: '02.03.2025', from: '10:00', to: '12:00' },
  { day: '09.03.2025', from: '10:00', to: '12:00' },
  { day: '16.03.2025', from: '10:00', to: '12:00' },
  { day: '30.03.2025', from: '10:00', to: '12:00' },
]
const mockDifficultyDone:string="difficult";

  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [doneReservations, setDoneReservations] = useState<DoneReservation[]>(initialDoneReservations);

  useEffect(() => {
    const fetchData = async () => {
            const response = await fetch(backend_url + "api/reservations/get_reservation_with_timespans/" );
            const data: Reservation[] = await response.json();
            setReservations(data);
    };
  fetchData();
  })
  const changePanel = () => {
    setPanelState(prev => (prev === 0 ? 1 : 0));
  };

  const handleEndReservation = (id: number): void => {
    setReservations(prev => prev.filter(res => res.id !== id));
    alert("Rezerwacja zakończona");
  };

  const handleDeleteDoneReservation = (id: number): void => {
    setDoneReservations(prev => prev.filter(res => res.id !== id));
    alert("Rezerwacja została usunięta");
  };

  if (!isAuth) return null;

  const isScrollable =
    (activeTab === "reserve_now" && reservations.length > 3) ||
    (activeTab === "reserve_done" && doneReservations.length > 3);

  return (
    <div className={styles.profile_container}>
      <div className={styles.top_container}>
        <div className={styles.userinfo}>
          Konto
          <div className={styles.indexInfo}>
            <i className="fa-solid fa-user-pen"></i>
            <p className={styles.indextekst}>
              Username: <span>{username}</span>
            </p>
          </div>
        </div>
        {role === "admin" && (
          <button className={styles.panels_change} onClick={changePanel}>
            {panelState === 0 ? "Przełącz na admin panel" : "Przełącz na user panel"}
          </button>
        )}
      </div>

      {panelState === 0 ? (
        <div className={styles.tabs_rezerwacje}>
          <div className={styles.tabs}>
            <button
              className={styles[activeTab === "reserve_now" ? "active_specs" : "non_specs"]}
              onClick={() => setActiveTab("reserve_now")}
            >
              Aktualne rezerwacje
            </button>
            <button
              className={styles[activeTab === "reserve_done" ? "active_notes" : "non_notes"]}
              onClick={() => setActiveTab("reserve_done")}
            >
              Zakończone rezerwacje
            </button>
          </div>

          {activeTab === "reserve_now" ? (
            <div className={`${styles.tab_content} ${reservations.length > 3 ? styles.scrollable_reservations : ''}`}>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <ReservatioNow
                    key={reservation.id}
                    id={reservation.id}
                    title={reservation.title}
                    description={reservation.description}
                    timeLeft={reservation.timeLeft}
                    onEndReservation={() => handleEndReservation(reservation.id)}
                    timeDetails={mockTime}
                    timeDifficulty={mockDifficulty}
                  />
                ))
              ) : (
                <p>Brak aktywnych rezerwacji.</p>
              )}
            </div>
          ) : (
            <div className={`${styles.tab_content} ${doneReservations.length > 4 ? styles.scrollable_reservations : ''}`}>
              {doneReservations.length > 0 ? (
                doneReservations.map((reservation) => (
                  <ReservationDone
                    key={reservation.id}
                    id={reservation.id}
                    title={reservation.title}
                    description={reservation.description}
                    completedAt={reservation.completedAt}
                    onDelete={() => handleDeleteDoneReservation(reservation.id)}
                    timeDetails={mockTimeDone}
                    timeDifficulty={mockDifficultyDone}
                  />
                ))
              ) : (
                <p>Brak zakończonych rezerwacji.</p>
              )}
            </div>
          )}

        </div>
      ) : (
        <div className={styles.create_new_items}>
          <div className={styles.tabs}>
            <button
              className={styles[activeTab2 === "new_item" ? "active_specs" : "non_specs"]}
              onClick={() => setActiveTab2("new_item")}
            >
              Nowy przedmiot
            </button>
            <button
              className={styles[activeTab2 === "users" ? "active_notes" : "non_notes"]}
              onClick={() => setActiveTab2("users")}
            >
              Użytkownicy
            </button>
            <button
              className={styles[activeTab2 === "new_post" ? "active_post" : "non_post"]}
              onClick={() => setActiveTab2("new_post")}
            >
              Nowy post
            </button>
          </div>

          <div className={styles.tab_content}>
            {activeTab2 === "new_item" ? (
              <NewItem></NewItem>
            ) : activeTab2 === "users" ? (
              <NewUser></NewUser>
            ) : (
              <NewPost></NewPost>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
