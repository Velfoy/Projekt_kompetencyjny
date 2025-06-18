import React from 'react';
import '@styles/components/RezerwacjaBlok.css';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    id:number
  title: string;
  description: string;
  imageUrl: string;
  role:string;
    onDelete?: (id: number) => void;
}

const RezerwacjaBlok: React.FC<ProductCardProps> = ({ id,title, description, imageUrl ,role,onDelete}) => {
  return (
    <div className="product-card">
      <div className="product-text">
        <div className='title_box'>
             <h3>{title}</h3>
              {role === 'admin' && (
                <i
                    className="fa-solid fa-trash-can trash-icon"
                    onClick={() => onDelete?.(id)}
                ></i>
                )}
        </div>
        <p>{description}</p>
        <div className="product-buttons">
          <Link to={`/reservationCalendar/${id}`} className="reserve-button">Przejdź do rezerwacji</Link>
          <Link to={`/itemReservation/${id}`} className="details-button">Szczegóły</Link>

        </div>
      </div>
      <div className='itemRezervation_image'>
        <img src={imageUrl} alt={title} className="product-image" />
      </div>
    </div>
  );
};

export default RezerwacjaBlok;
