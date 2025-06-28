import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/pages/zgloszenia.module.css';
import ReservationAcceptation from '@/src/components/ui/zgloszenia/ReservationAcceptation';
import ReservationTime from '@/src/components/ui/timeLogic/ReservationTime';
import { backend_url } from '@/src/main';
// import { backend_url } from '@/src/main';

interface Reservation {
  id: number;
  unit: string;
  unit_id:number,
  submittedBy: string;
}
interface DaySchedule {
  day: string;
  from: string;
  to: string;
}

const mockTime:DaySchedule[]=[
  { day: '02.03.2025', from: '10:00', to: '12:00' },
  { day: '09.03.2025', from: '10:00', to: '12:00' },
  { day: '16.03.2025', from: '10:00', to: '12:00' },
  { day: '30.03.2025', from: '10:00', to: '12:00' },
]
const mockDifficulty:string="difficult";

const ZgloszeniaPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(backend_url + "api/admin/get_reservations", {method: 'GET',  
          headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
        const data: Reservation[] = await response.json();
        setReservations(data);
      };
      fetchData();
    }, []);
    console.log(reservations);
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [timeWindow,setTimeWindow]=useState(false);
  const token = localStorage.getItem('auth_token')
  const itemsPerPage = 5;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageCount = Math.ceil(reservations.length / itemsPerPage);
  const currentItems = reservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRowExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleReservationAction = (id: number, action: 'accept' | 'reject') => {
    setSelectedReservationId(id);
    setActionType(action);
  };

  const handleConfirmAction = async (accepted: boolean) => {
    if (!selectedReservationId) return;
    
    // Here you would typically make an API call
    console.log(`Reservation ${selectedReservationId} ${accepted ? 'accepted' : 'rejected'}`);

    await fetch(backend_url + "api/admin/" + (accepted ? "accept/" : "deny/") + selectedReservationId, {method: 'POST',  
          headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
    const response = await fetch(backend_url + "api/admin/get_reservations", {method: 'GET',  
          headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
    const data: Reservation[] = await response.json();
    setReservations(data);
    
    // Reset selection
    setSelectedReservationId(null);
    setActionType(null);
    
    // Adjust current page if we're on an empty page
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(prev => Math.min(prev, pageCount - 1));
    }
  };
  const DisplayTimeDetails=()=>{
    setTimeWindow(true);
  }

  return (
    <div className={styles.container_zgloszenia}>
      {/* Header Row */}
      <div className={`${styles.item_zgloszenia} ${styles.header_zgloszenia}`}>
        <div className={styles.column_zgloszenia}>
          {windowWidth > 400 ? 'Rezerwowana jednostka:' : 'Info'}
        </div>
        {windowWidth > 650 && (
          <div className={styles.column_zgloszenia}>Zgłoszone przez:</div>
        )}
        {windowWidth > 850 && (
          <div className={styles.column_zgloszenia}>Termin rezerwacji:</div>
        )}
        <div className={`${styles.column_zgloszenia} ${styles.accept_column}`}>
          Zaakceptuj:
        </div>
      </div>

      {/* Data Rows */}
      {currentItems.map((res) => (
        <div key={res.id}>
          <div className={styles.item_zgloszenia}>
            <div className={styles.column_zgloszenia}>
              <Link className={styles.Link} to={`/itemReservation/${res.unit_id}`}>
                <p>{res.unit}</p>
                <i className="fa-solid fa-circle-info"></i>
              </Link>
              <i 
                className={`fa-solid fa-chevron-${expandedRow === res.id ? 'down' : 'right'}`}
                onClick={() => toggleRowExpand(res.id)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
            {windowWidth > 650 && (
              <div className={styles.column_zgloszenia}>
                <p>{res.submittedBy}</p>
              </div>
            )}
            {windowWidth > 850 && (
              <div className={styles.column_zgloszenia}>
                <button onClick={DisplayTimeDetails} className={styles.detailButton_zgloszenia}>Zobacz szczegóły</button>
              </div>
            )}
            <div className={styles.column_zgloszenia}>
              <div className={styles.toggleButtons}>
                <button 
                  className={styles.buttonYes_zgloszenia}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReservationAction(res.id, 'accept');
                  }}
                >
                  Tak
                </button>
                <button 
                  className={styles.buttonNo_zgloszenia}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReservationAction(res.id, 'reject');
                  }}
                >
                  Nie
                </button>
              </div>
            </div>
          </div>

          {/* Expanded row details for mobile */}
          {expandedRow === res.id && (
            <div className={styles.expanded_details}>
              {(windowWidth <= 400)&&(
                <div className={styles.detail_row}>
                  <span className={styles.detail_label}>Rezerwowana jednostka:</span>
                  <span>{res.unit}</span>
                </div>
              )}
              {(windowWidth <= 650)&&(
                <div className={styles.detail_row}>
                  <span className={styles.detail_label}>Zgłoszone przez:</span>
                  <span>{res.submittedBy}</span>
                </div>
              )}
              {(windowWidth <= 850)&&(
                <div className={styles.detail_row}>
                  <span className={styles.detail_label}>Termin rezerwacji:</span>
                  <button onClick={DisplayTimeDetails} className={styles.detailButton_zgloszenia}>Zobacz szczegóły</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className={styles.pagination_zgloszenia}>
        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          <i className="fa-solid fa-angles-left"></i>
        </button>
        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          {windowWidth > 470 ? 'Poprzedni' : <i className="fa-solid fa-chevron-left"></i>}
        </button>

        {(() => {
          const pages = [];
          if (pageCount <= 5) {
            for (let i = 1; i <= pageCount; i++) {
              pages.push(
                <button
                  key={i}
                  className={`${styles.pageButton_zgloszenia} ${
                    currentPage === i ? styles.active_zgloszenia : ''
                  }`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </button>
              );
            }
          } else {
            pages.push(
              <button
                key={1}
                className={`${styles.pageButton_zgloszenia} ${
                  currentPage === 1 ? styles.active_zgloszenia : ''
                }`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
            );

            if (currentPage > 3) {
              pages.push(<span key="dots-start">...</span>);
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(pageCount - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  className={`${styles.pageButton_zgloszenia} ${
                    currentPage === i ? styles.active_zgloszenia : ''
                  }`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </button>
              );
            }

            if (currentPage < pageCount - 2) {
              pages.push(<span key="dots-end">...</span>);
            }

            pages.push(
              <button
                key={pageCount}
                className={`${styles.pageButton_zgloszenia} ${
                  currentPage === pageCount ? styles.active_zgloszenia : ''
                }`}
                onClick={() => setCurrentPage(pageCount)}
              >
                {pageCount}
              </button>
            );
          }

          return pages;
        })()}

        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          {windowWidth > 470 ? 'Następny' : <i className="fa-solid fa-chevron-right"></i>}
        </button>
        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage(pageCount)}
        >
          <i className="fa-solid fa-angles-right"></i>
        </button>
      </div>

      {/* Acceptation Modal */}
      {selectedReservationId && (
        <ReservationAcceptation
          reservation_id={selectedReservationId}
          onClose={() => {
            setSelectedReservationId(null);
            setActionType(null);
          }}
          onConfirm={handleConfirmAction}
          initialAction={actionType}
        />
      )}
      {timeWindow && (
        <ReservationTime
          difficulty={mockDifficulty}
          schedule={mockTime}
          onClose={() => setTimeWindow(false)}
        />
      )//Here is a big problem since seamless integration is not possible w/o significantly remaking the logic and I ain't doing that.
      }
    </div>
  );
};

export default ZgloszeniaPage;