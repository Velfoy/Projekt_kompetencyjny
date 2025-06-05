import React from "react";
import styles from '../../styles/pages/historiaadmin.module.css';
import DataTable from "@/src/components/ui/DataTable";
import type  { RowData, Column, DropdownAction } from "@/src/components/ui/DataTable";

// Пример данных
const rows: RowData[] = [
  { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" },
  { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" },
  { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" },
  { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" },
  { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" },
  { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" },
  { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" },
];


// Пример колонок
const columns: Column[] = [
  { key: "id", label: "Id/Imię" },
  { key: "type", label: "Typ" },
  { key: "item",
    label: "Do rezerwacji",
    render:(row)=><p>{row.item}<a href="https://www.miejski.pl/slowo-FFF"><i className="fa-solid fa-circle-info"></i></a></p>,
   },
  { key: "unit", label: "Jednostka" },
  {
    key: "status",
    label: "Status rezerwacji",
    render: (row) => <span className="status">{row.status}</span>,
  },
  {
    key: "details",
    label: "Termin rezerwacji",
    render: () => <button className="button">Zobacz szczegóły</button>,
  },
  {
    key: "actions",
    label: "Akcje",
    render: () => (
      <div className="actions">
        <button className="button" title="Edit">✏️</button>
        <button className="button" title="Delete">🗑️</button>
      </div>
    ),
  },
];

// Пример действий в дропдауне
const dropdownActions: DropdownAction[] = [
  { label: "Usuń zaznaczone", onClick: () => alert("Zaznaczone usunięte") },
  { label: "Usuń wszystkie", onClick: () => alert("Wszystkie usunięte") },
];


const HistoriaAdmin = () => {

  return (
    <div className={styles.container}>
      <DataTable
  columns={columns}
  data={rows}
  view="admin"
  dropdownActions={dropdownActions}
  itemsPerPage={5}
/>

    </div>
  );
};

export default HistoriaAdmin;