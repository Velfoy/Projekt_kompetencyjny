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

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  text,
  image,
  highlight = false,
  button,
}) => {
  return (
    <div
      className={`card_divv ${highlight ? "highlight" : ""}`}
    >
      <div className="card-content">
        <div className="text-content">
          <h5 className="title_news">{title}</h5>
          <p className="text_news">{text}</p>
        </div>
        <div className="image-content">
          <img src={image} alt="" className="image_news" />
        </div>
      </div>
      {button && <button className="button_card_news">{button}</button>}
    </div>
  );
};

const NewsSection: React.FC = () => {
  return (
    <div className="my-4 all_news">
      <h2 className="fw-bold mb-3 news_header">Nowości</h2>

      <NewsCard
        title="Otwarcie strony rezerwacyjnej A7"
        text="Z radością informujemy o uruchomieniu naszej nowej strony rezerwacyjnej A7! Teraz łatwiej niż kiedykolwiek możesz zarezerwować sale oraz sprzęt, dostosowane do Twoich potrzeb."
        image={buildingImg}
        highlight={false}
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
