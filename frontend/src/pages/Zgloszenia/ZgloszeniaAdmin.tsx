import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/pages/zgloszenia.module.css';
import ReservationAcceptation from '@/src/components/ui/zgloszenia/ReservationAcceptation';
import ReservationTime from '@/src/components/ui/timeLogic/ReservationTime';

interface Reservation {
  id: number;
  unit: string;
  unit_id:number,
  submittedBy: string;
  dateReservationId:number;
}
interface DaySchedule {
  day: string;
  from: string;
  to: string;
}


const mockReservations: Reservation[] = [
  { id: 1,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1,},
  { id: 2,unit_id:3, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:2,},
  { id: 3, unit_id:4,unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl',dateReservationId:3, },
  { id: 4,unit_id:5, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' ,dateReservationId:4,},
  { id: 5,unit_id:6, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:5, },
  { id: 6,unit_id:6, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:6,},
  { id: 7, unit_id:7,unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:7, },
  { id: 8, unit_id:1,unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:8, },
  { id: 9,unit_id:54, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' ,dateReservationId:9,},
  { id: 10,unit_id:6, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' ,dateReservationId:1,},
  { id: 11,unit_id:7, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 12,unit_id:79, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 13,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 14,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 15,unit_id:2, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl',dateReservationId:1, },
  { id: 16,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 17,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' ,dateReservationId:1,},
  { id: 18,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 19,unit_id:2, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl',dateReservationId:1, },
  { id: 20,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1,},
   { id: 21,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1,},
  { id: 22,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1,},
  { id: 23,unit_id:2, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl',dateReservationId:1, },
  { id: 24,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' ,dateReservationId:1,},
  { id: 25,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 26,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1,},
  { id: 27,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1,},
  { id: 28,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 29,unit_id:2, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl',dateReservationId:1, },
  { id: 30,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 31,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 32,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 33,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 34,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 35,unit_id:2, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl',dateReservationId:1, },
  { id: 36, unit_id:2,unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 37,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1, },
  { id: 38,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' ,dateReservationId:1,},
  { id: 39,unit_id:2, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' ,dateReservationId:1,},
  { id: 40,unit_id:2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl',dateReservationId:1,},
];

const mockTime:DaySchedule[]=[
   {day:"29.05.2025",from:"10:00",to:"12:00"},
  {day:"29.05.2025",from:"18:00",to:"19:00"},
]
const mockDifficulty:string="difficult";

const ZgloszeniaPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [timeWindow,setTimeWindow]=useState(0);
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

  const handleConfirmAction = (accepted: boolean) => {
    if (!selectedReservationId) return;
    
    // Here you would typically make an API call
    console.log(`Reservation ${selectedReservationId} ${accepted ? 'accepted' : 'rejected'}`);
    
    // Remove the reservation from the list
    setReservations(prev => prev.filter(r => r.id !== selectedReservationId));
    
    // Reset selection
    setSelectedReservationId(null);
    setActionType(null);
    
    // Adjust current page if we're on an empty page
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(prev => Math.min(prev, pageCount - 1));
    }
  };
  const DisplayTimeDetails=()=>{
    setTimeWindow(1);
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
                  <button className={styles.detailButton_zgloszenia}>Zobacz szczegóły</button>
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
        />

      )
      }
    </div>
  );
};

export default ZgloszeniaPage;