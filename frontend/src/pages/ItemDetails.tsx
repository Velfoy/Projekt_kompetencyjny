import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@styles/pages/ItemDetails.css";
import productImage from "/img/default-image.png";
import { backend_url } from "../main";


const mockData = [
  {
    id: "1",
    name: "STM32",
    description:
      "STM32 – rodzina 32–bitowych mikrokontrolerów w układach scalonych produkowanych przez francusko-włoską firmę STMicroelectronics.",
    unit: "Voxel",
    category: "Urządzenia",
    type: "Mikrokontrolery",
    address: "Raptors, pokój nr. 3, szafa po lewej stronie, piąta półka od dołu.",
    guardian_email: "g.zwolinski@edu.p.lodz.pl",
    exploration_rules:
      "Nie wolno rzucać płytki, jeść z płytki, maczać płytkę w musztardzie, dotykać brudnymi palcami.",
    specs: [
      "Arm 32-bit Cortex-M3 CPU Core, 72 MHz maximum frequency",
      "1.25 DMIPS/MHz performance",
      "64 or 128 KBytes of Flash memory",
      "Clock, reset and supply management",
      "2x 12-bit, 1 µs A/D converters (up to 16 channels)",
      "DMA",
    ],
    notes: "Nie należy podłączać przy użyciu płytek w masztach...",
    documentation: [
      { name: "STM_ELEVATOR_RUN.pdf", url: "#" },
      { name: "STM_DOCUMENTATION.docx", url: "#" },
    ],
    image: "/img/stm.jpg",
  },
  {
    id: "2",
    name: "Rezerwacja 2",
    description: "Opis produktu rezerwacji 2.",
    unit: "Voxel",
    category: "Urządzenia",
    type: "Mikrokontrolery",
    address: "Raptors, pokój nr. 3, szafa po lewej stronie, piąta półka od dołu.",
    guardian_email: "g.zwolinski@edu.p.lodz.pl",
    exploration_rules:
      "Nie wolno rzucać płytki, jeść z płytki, maczać płytkę w musztardzie, dotykać brudnymi palcami.",
    specs: ["Specyfikacja 2A", "Specyfikacja 2B"],
    notes: "Uwagi do rezerwacji 2.",
    documentation: [],
    image: "/placeholder.png",
  },
  {
    id: "3",
    name: "Rezerwacja 3",
    description: "Opis produktu rezerwacji 3.",
    unit: "Voxel",
    category: "Urządzenia",
    type: "Mikrokontrolery",
    address: "Raptors, pokój nr. 3, szafa po lewej stronie, piąta półka od dołu.",
    guardian_email: "g.zwolinski@edu.p.lodz.pl",
    exploration_rules:
      "Nie wolno rzucać płytki, jeść z płytki, maczać płytkę w musztardzie, dotykać brudnymi palcami.",
    specs: [],
    notes: "Brak uwag.",
    documentation: [],
    image: "/placeholder.png",
  },
];

const mockComments = [
  {
    id: 1,
    author: "Ewa Korzyniewska",
    text: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum...",
    date: "24 marca 2025",
  },
  {
    id: 2,
    author: "Ewa Korzyniewska",
    text: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum...",
    date: "24 marca 2025",
  },
  {
    id: 3,
    author: "Ewa Korzyniewska",
    text: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum...",
    date: "24 marca 2025",
  },
];

//const userName = "Valeriia Zlydar";

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("specs");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("")
  const [booking, setBooking] = useState(mockData.find(() => id === id));
  const token = localStorage.getItem('auth_token')
  if (!token)
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h2>Nie znaleziono rezerwacji</h2>
        <p>
          Rezerwacja o ID: <strong>{id}</strong> nie istnieje lub została
          usunięta.
        </p>
        <p>Sprawdź poprawność adresu URL lub wybierz inną pozycję z listy.</p>
      </div>
    </div>
  );//Access error, 404 is temporary

  useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(backend_url + "api/users/whoami");
        const data = await response.json();
        setUserName(data.username);
      };
      fetchData();
    }, []);

  useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(backend_url + "api/item/get_comments/" + id);
        const data = await response.json();
        setComments(data);
      };
      fetchData();
    }, []);

  console.log(booking);

    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(backend_url + "api/item/get_item/" + id);
        const data = await response.json();
        setBooking(data);
      };
      fetchData();
    }, []);
    console.log(id)
  

  // if (!booking)
  // return (
  //   <div className="not-found-container">
  //     <div className="not-found-card">
  //       <h2>Nie znaleziono rezerwacji</h2>
  //       <p>
  //         Rezerwacja o ID: <strong>{id}</strong> nie istnieje lub została
  //         usunięta.
  //       </p>
  //       <p>Sprawdź poprawność adresu URL lub wybierz inną pozycję z listy.</p>
  //     </div>
  //   </div>
  // );
  //Lera will later change that so that it displays "Loading" 


  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    console.log(id)

    const comment = {
      item_id: id,
      author: userName,
      text: newComment,
      date: new Date().toISOString(),
    };
    console.log(JSON.stringify(comment))
    await fetch(backend_url + "api/item/add_comment/", {method: 'POST', 
      body: JSON.stringify(comment), 
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
    const response = await fetch(backend_url + "api/item/get_comments/" + id);
    const data = await response.json();
    setComments(data);
    setNewComment("");
  };

  const handleDeleteComment = (id: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };
  const [imgSrc, setImgSrc] = useState(booking.image || productImage);


  return (
    
    <div className="itemDetails_container">
      <div className="top-section">
        <div className="image-container">
          <img src={imgSrc} alt={booking.name} onError={() => setImgSrc(productImage)}/>
        </div>
        <div className="description">
          <div className="header_description">
            <h2>{booking.name}</h2>
            <p className="breadcrumbs">
              {booking.unit} - {booking.category} - {booking.type}
            </p>
          </div>
          <p className="text_desc">{booking.description}</p>
          <p className="address_text">
            <strong>
              <i className="fa-solid fa-map-location"></i>
            </strong>{" "}
            {booking.address}
          </p>
          <p className="opiekun_text">
            <strong>Opiekun:</strong> {booking.guardian_email}
          </p>
          <p className="exploration_rules">
            <strong>Zasady eksploracji:</strong>
            <p>{booking.exploration_rules}</p>
          </p>
          <p className="dokumentacja_text">
            <strong>Dokumentacja techniczna:</strong>
            <ul>
              {booking.documentation.length > 0 ? (
                booking.documentation.map((doc, i) => (
                  <li key={i}>
                    <a href={doc.url}>{doc.name}</a>
                  </li>
                ))
              ) : (
                <li>Brak dokumentacji</li>
              )}
            </ul>
          </p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "specs" ? "active_specs" : "non_specs"}
          onClick={() => setActiveTab("specs")}
        >
          Specyfikacja techniczna
        </button>
        <button
          className={activeTab === "notes" ? "active_notes" : "non_notes"}
          onClick={() => setActiveTab("notes")}
        >
          Uwagi
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "specs" ? (
          booking.specs?.length > 0 ? (
            <ul>
              {booking.specs.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          ) : (
            <p>Brak danych technicznych.</p>
          )
        ) : (
          <div className="notes-section">
            <textarea
              placeholder="Zostaw komentarz"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Dodaj</button>
            <p>{comments.length} uwag (notatki odnośnie stanu przedmiotu)</p>
            <ul className="comments-list">
              {comments.map((note) => (
                <li key={note.id} className="comment">
                  <div className="comment-header">
                    <strong>{note.author}</strong>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteComment(note.id)}
                      title="Usuń komentarz"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  <p>{note.text}</p>
                  <span className="comment-date">{note.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
