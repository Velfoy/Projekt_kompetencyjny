import React from "react";
import "@styles/components/DataTable.css";

interface RowData {
  id: number;
  type: string;
  location: string;
  unit: string;
  status: string;
}

const rows: RowData[] = Array.from({ length: 7 }, () => ({
  id: 248655,
  type: "Pokój",
  location: "p. 17",
  unit: "Voxel",
  status: "Brak akceptacji",
}));

const DataTable: React.FC = () => {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Id/Imię</th>
            <th>Typ</th>
            <th>Do rezerwacji</th>
            <th>Jednostka</th>
            <th>Status rezerwacji</th>
            <th>Termin rezerwacji</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td><input type="checkbox" /></td>
              <td>{row.id}</td>
              <td>{row.type}</td>
              <td>{row.location}</td>
              <td>{row.unit}</td>
              <td><span className="status">{row.status}</span></td>
              <td><button className="button">Zobacz szczegóły</button></td>
              <td className="actions">
                <button title="Edit" className="button">✏️</button>
                <button title="Delete" className="button">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <div>
          Poprzedni <span>1 2 <b>3</b> 4 5 … 126</span> Następny
        </div>

        <div>
          <div className="dropdown">
            <button className="button">Usuń</button>
            <div className="dropdown-content">
              <button className="button">Usuń zaznaczone</button>
              <button className="button">Usuń wszystkie</button>
            </div>
          </div>
          <button className="button">Zastosuj</button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
