import React from 'react';
import '@styles/components/A7ReservationCard.css';
import buildingSvg from '@assets/img/back_svg.svg';
import buttonImg from '@assets/img/button.png';
import a7Image from '@assets/img/building.jpg';

const A7ReservationCard: React.FC = () => {
  return (
    <div className="a7-card-wrapper">
      <img src={buildingSvg} alt="Tło karty" className="a7-background-image" />

      <div className="image_a7_wrapper">
        <img src={a7Image} alt="Image of Building A7" />
      </div>
      
      <div className="text_a7_wrapper">
        <h1 className="a7_header">REZERWACJA A7</h1>
        <p className="description_a7">
          Nasza platforma umożliwia łatwą i szybką rezerwację sal oraz sprzętu elektrycznego dostosowanego do różnorodnych potrzeb.<br/><br/>
          Dzięki intuicyjnemu systemowi, możesz zarezerwować odpowiednią przestrzeń oraz niezbędne wyposażenie techniczne w zaledwie kilka kliknięć.
        </p>
      </div>
      
      <div className="a7-button-wrapper">
        <button className="a7-button" aria-label="Zaloguj się">
          <img src={buttonImg} alt="" className="a7-button-image" />
          <span className="a7-button-text">Zaloguj się</span>
        </button>
      </div>
    </div>
  );
};

export default A7ReservationCard;