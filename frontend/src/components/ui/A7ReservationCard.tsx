import React from 'react';
import '@styles/components/A7ReservationCard.css';
import buildingSvg from '@assets/img/back_svg.svg';
import buttonSvg from '@assets/img/button_svg.svg';

const A7ReservationCard: React.FC = () => {
  return (
    <div className="a7-card-wrapper">
      <img src={buildingSvg} alt="Tło karty" className="a7-background-image" />

      <div className="a7-button-wrapper">
        <button className="a7-button" aria-label="Zaloguj się">
          <img src={buttonSvg} alt="" className="a7-button-image" />
          <span className="a7-button-text">Zaloguj się</span>
        </button>
      </div>
    </div>
  );
};

export default A7ReservationCard;