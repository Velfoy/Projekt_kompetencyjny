import React from "react";
import "@styles/components/NewsSection.css";
import buildingImg from "@assets/img/building.jpg"; 

interface NewsCardProps {
  title: string;
  text: string;
  image: string;
  highlight?: boolean;
  button?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, text, image, highlight = false, button }) => {
  return (
    <div
      className={`card mb-4 p-3 shadow-sm ${highlight ? "border border-primary" : "border-0"}`}
      style={{
        backgroundColor: highlight ? "#e1eae6" : "#dde5d8",
        borderRadius: "1rem",
      }}
    >
      <div className="row g-3 align-items-center">
        <div className="col-md-9">
          <h5 className="card-title fw-bold">{title}</h5>
          <p className="card-text mt-2">{text}</p>
          {button && (
            <button className="btn btn-dark mt-3">{button}</button>
          )}
        </div>
        <div className="col-md-3 text-center">
          <img
            src={image}
            alt=""
            className="img-fluid rounded"
            style={{ maxHeight: "100px", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

const NewsSection: React.FC = () => {
  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">Nowości</h2>

      <NewsCard
        title="Otwarcie strony rezerwacyjnej A7"
        text="Z radością informujemy o uruchomieniu naszej nowej strony rezerwacyjnej A7! Teraz łatwiej niż kiedykolwiek możesz zarezerwować sale oraz sprzęt, dostosowane do Twoich potrzeb."
        image={buildingImg}
        highlight={true}
      />

      <NewsCard
        title="Sala 206 – remont w toku!"
        text="Przeprowadzamy prace remontowe w sali 205, aby zapewnić naszym gościom jeszcze lepsze warunki..."
        image={buildingImg}
        highlight={false}
        button="Dowiedz się więcej"
      />
    </div>
  );
};

export default NewsSection;
