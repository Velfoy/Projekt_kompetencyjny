import React, { useEffect, useState } from "react";
import "@styles/components/NewsSection.css";
import buildingImg from "@assets/img/building.jpg";
import { backend_url } from "@/src/main";

// --- Mock Data ---
interface NewsItem {
  title: string;
  text: string;
  image: string;
  highlight?: boolean;
  button?: string;
  link?: string;
}

const mockNews: NewsItem[] = [
  {
    title: "Otwarcie strony rezerwacyjnej A7",
    text: "Z radością informujemy o uruchomieniu naszej nowej strony rezerwacyjnej A7! Teraz łatwiej niż kiedykolwiek możesz zarezerwować sale oraz sprzęt, dostosowane do Twoich potrzeb.",
    image: buildingImg,
    highlight: false,
  },
  {
    title: "Sala 206 – remont w toku!",
    text: "Przeprowadzamy prace remontowe w sali 205, aby zapewnić naszym gościom jeszcze lepsze warunki...",
    image: buildingImg,
    highlight: false,
    button: "Dowiedz się więcej",
    link: "https://www.youtube.com/watch?v=q9leDzlNEaY&ab_channel=HYBELABELS",
  },
];
const [news, setNews] = useState<NewsItem[]>([])
useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(backend_url + "api/news/get_news");
      const data: NewsItem[] = await response.json();
      setNews(data);
    };
    fetchData();
  }, []);

// --- News Card Component ---
interface NewsCardProps extends NewsItem {}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  text,
  image,
  highlight = false,
  button,
  link,
}) => {
  return (
    <div className={`card_divv ${highlight ? "highlight" : ""}`}>
      <div className="card-content">
        <div className="text-content">
          <h5 className="title_news">{title}</h5>
          <p className="text_news">{text}</p>
        </div>
        <div className="image-content">
          <img src={image} alt="" className="image_news" />
        </div>
      </div>
      {button && link && (
        <a href={link} target="_blank"className="button_card_news">
          {button}
        </a>
      )}
    </div>
  );
};

// --- News Section ---
const NewsSection: React.FC = () => {
  return (
    <div className="my-4 all_news">
      <h2 className="fw-bold mb-3 news_header">Nowości</h2>
      {news.map((news, index) => (
        <NewsCard key={index} {...news} />
      ))}
    </div>
  );
};

export default NewsSection;
