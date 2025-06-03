import React, { useState } from 'react';
import styles from '../../styles/pages/zgloszenia.module.css';

const mockReservations = [
  { id: 1, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 3, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 4, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 5, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 6, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
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
  { id: 20, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 21, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 22, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 23, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 24, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 25, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 26, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
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
  { id: 40, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
];

const ZgloszeniaPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const pageCount = Math.ceil(mockReservations.length / itemsPerPage);
  const currentItems = mockReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container_zgloszenia}>
      {/* Header Row */}
      <div className={`${styles.item_zgloszenia} ${styles.header_zgloszenia}`}>
        <div className={styles.column_zgloszenia}>Rezerwowana jednostka:</div>
        <div className={styles.column_zgloszenia}>Zgłoszone przez:</div>
        <div className={styles.column_zgloszenia}>Termin rezerwacji:</div>
        <div className={`${styles.column_zgloszenia} ${ styles.accept_column}`}>Zaakceptuj:</div>
      </div>

      {/* Data Rows */}
      {currentItems.map((res) => (
        <div key={res.id} className={styles.item_zgloszenia}>
          <div className={styles.column_zgloszenia}>
            <p>{res.unit}</p>
            <i className="fa-solid fa-circle-info"></i>
          </div>
          <div className={styles.column_zgloszenia}>
            <p>{res.submittedBy}</p>
          </div>
          <div className={styles.column_zgloszenia}>
            <button className={styles.detailButton_zgloszenia}>Zobacz szczegóły</button>
          </div>
          <div className={styles.column_zgloszenia}>
            <div className={styles.toggleButtons}>
              <button className={styles.buttonYes_zgloszenia}>Tak</button>
              <button className={styles.buttonNo_zgloszenia}>Nie</button>
            </div>
          </div>
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
          Poprzedni
        </button>

        {(() => {
          const pages = [];
          if (pageCount <= 5) {
            for (let i = 1; i <= pageCount; i++) {
              pages.push(
                <button
                  key={i}
                  className={`${styles.pageButton_zgloszenia} ${currentPage === i ? styles.active_zgloszenia : ''}`}
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
                className={`${styles.pageButton_zgloszenia} ${currentPage === 1 ? styles.active_zgloszenia : ''}`}
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
                  className={`${styles.pageButton_zgloszenia} ${currentPage === i ? styles.active_zgloszenia : ''}`}
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
                className={`${styles.pageButton_zgloszenia} ${currentPage === pageCount ? styles.active_zgloszenia : ''}`}
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
          Następny
        </button>
        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage(pageCount)}
        >
          <i className="fa-solid fa-angles-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ZgloszeniaPage;
