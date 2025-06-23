import React from 'react';
import '@styles/components/A7ReservationCard.css';
import buildingSvg from '@assets/img/back_svg.svg';
import buttonImg from '@assets/img/button.png';
import a7Image from '@assets/img/building.jpg';
import { useAuth } from '@/src/hooks/useAuth';
import { Link } from 'react-router-dom';

const A7ReservationCard: React.FC = () => {
  const {isAuth,role,login}=useAuth();
  return (
    <div className="a7-card-wrapper">
      <img src={buildingSvg} alt="Tło karty" className="a7-background-image" />

      <div className="image_a7_wrapper">
        <img src={a7Image} alt="Image of Building A7" />
      </div>
      
      <div className="text_a7_wrapper">
        <h1 className="a7_header">REZERWACJA A7</h1>
        <p className="description_a7">
          Nasza platforma umożliwia łatwą i szybką rezerwację sal oraz sprzętu elektrycznego dostosowanego do różnorodnych potrzeb.
          Dzięki intuicyjnemu systemowi, możesz zarezerwować odpowiednią przestrzeń oraz niezbędne wyposażenie techniczne w zaledwie kilka kliknięć.
        </p>
      </div>
      
      <div className="a7-button-wrapper">
        <Link to={isAuth?(role==='admin'?("/zgloszenia"):("/kalendarz")): ("/login")}  onClick={!isAuth ? login : undefined} className="a7-button">
          <img src={buttonImg} alt="" className="a7-button-image" />
          <span className="a7-button-text">
            {isAuth?(role==='admin'?("Zobacz zgłoszenia"):("Przejdź do rezerwacji")): ("Zaloguj się")}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default A7ReservationCard;