import React, { useState, useEffect } from 'react';
import styles from '../../styles/pages/zgloszenia.module.css';
import ReservationAcceptation from '@/src/components/ui/zgloszenia/ReservationAcceptation';

interface Reservation {
  id: number;
  unit: string;
  submittedBy: string;
}

const mockReservations: Reservation[] = [
  { id: 1, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl'},
  { id: 2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl'},
  { id: 3, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 4, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 5, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 6, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl'},
  { id: 7, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 8, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 9, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 10, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 11, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 12, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 13, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 14, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 15, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 16, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 17, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 18, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 19, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 20, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl'},
   { id: 21, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl'},
  { id: 22, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl'},
  { id: 23, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 24, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 25, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 26, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl'},
  { id: 27, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 28, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 29, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 30, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 31, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 32, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 33, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 34, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 35, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 36, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 37, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 38, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 39, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 40, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl'},
];

const ZgloszeniaPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
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
              <>
                <p>{res.unit}</p>
                <i className="fa-solid fa-circle-info"></i>
              </>
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
                <button className={styles.detailButton_zgloszenia}>Zobacz szczegóły</button>
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
    </div>
  );
};

export default ZgloszeniaPage;