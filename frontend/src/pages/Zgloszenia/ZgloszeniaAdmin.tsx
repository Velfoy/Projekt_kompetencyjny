import React, { useState } from 'react';
import styles from '../../styles/pages/zgloszenia.module.css';

const mockReservations = [
  { id: 1, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 2, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 3, unit: 'Sala 12', submittedBy: 'p.drzymala@edu.p.lodz.pl' },
  { id: 4, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 5, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
  { id: 6, unit: 'STM32', submittedBy: '248655@edu.p.lodz.pl' },
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

      {currentItems.map((res) => (
        <div key={res.id} className={styles.item_zgloszenia}>
          <div className={styles.details_zgloszenia}>
            <div className={styles.block_zgloszenia}>
              <p className={styles.label_zgloszenia}>Rezerwowana jednostka:</p>
              <p className={styles.value_zgloszenia}>{res.unit}</p>
            </div>
            <div className={styles.block_zgloszenia}>
              <p className={styles.label_zgloszenia}>Zgłoszone przez:</p>
              <p className={styles.value_zgloszenia}>{res.submittedBy}</p>
            </div>
            <div className={styles.block_zgloszenia}>
              <p className={styles.label_zgloszenia}>Termin rezerwacji:</p>
              <button className={styles.value_zgloszenia}>Zobacz szczegóły</button>
            </div>
            <div className={styles.buttons_zgloszenia}>
              <button className={styles.buttonYes_zgloszenia}>Tak</button>
              <button className={styles.buttonNo_zgloszenia}>Nie</button>
          </div>
          </div>
        </div>
      ))}

      <div className={styles.pagination_zgloszenia}>
        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Poprzedni
        </button>
        {[...Array(pageCount)].map((_, i) => (
          <button
            key={i}
            className={`${styles.pageButton_zgloszenia} ${
              currentPage === i + 1 ? styles.active_zgloszenia : ''
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Następny
        </button>
      </div>
    </div>
  );
};

export default ZgloszeniaPage;
