import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "@styles/pages/ItemDetails.css";
const mockData = [
  {
    id: "1",
    name: "Rezerwacja 1",
    date: "2025-06-10",
    description:
      "STM32 – rodzina 32-bitowych mikrokontrolerów w układach scalonych produkowanych przez STMicroelectronics. Chipy STM32 są oparte na 32-bitowych procesorach ARM.",
    unit: "Voxel",
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
    image: "/stm32.png",
  },
  {
    id: "2",
    name: "Rezerwacja 2",
    date: "2025-06-12",
    description: "Opis produktu rezerwacji 2.",
    unit: "Delta",
    specs: ["Specyfikacja 2A", "Specyfikacja 2B"],
    notes: "Uwagi do rezerwacji 2.",
    documentation: [],
    image: "/placeholder.png",
  },
  {
    id: "3",
    name: "Rezerwacja 3",
    date: "2025-06-15",
    description: "Opis produktu rezerwacji 3.",
    unit: "Omega",
    specs: [],
    notes: "Brak uwag.",
    documentation: [],
    image: "/placeholder.png",
  },
];


const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("specs");

  const booking = mockData.find((item) => item.id === id);

  if (!booking) {
    return <div>Nie znaleziono rezerwacji o ID: {id}</div>;
  }

  return (
    <div className="container">
      <div className="top-section">
        <div className="image-container">
          <img src={booking.image} alt={booking.name} />
        </div>
        <div className="description">
          <h2>{booking.name}</h2>
          <p><strong>Data:</strong> {booking.date}</p>
          <p><strong>Jednostka:</strong> {booking.unit}</p>
          <p>{booking.description}</p>
          <ul>
            <li><strong>Dokumentacja techniczna:</strong></li>
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
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "specs" ? "active" : ""}
          onClick={() => setActiveTab("specs")}
        >
          Specyfikacja techniczna
        </button>
        <button
          className={activeTab === "notes" ? "active" : ""}
          onClick={() => setActiveTab("notes")}
        >
          Uwagi
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "specs" ? (
          booking.specs && booking.specs.length > 0 ? (
            <ul>
              {booking.specs.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          ) : (
            <p>Brak danych technicznych.</p>
          )
        ) : (
          <p>{booking.notes || "Brak dodatkowych uwag."}</p>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
