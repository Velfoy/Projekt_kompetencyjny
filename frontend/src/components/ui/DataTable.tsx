import React, { useState, useEffect } from "react";
import "@styles/components/DataTable.css";
import styles from "../../styles/pages/historiaadmin.module.css"; 

export interface Column {
  key: string;
  label: string;
  render?: (row: RowData) => React.ReactNode;
}

export interface RowData {
  [key: string]: any;
}

export type TableView = "admin" | "user";

export interface DropdownAction {
  label: string;
  onClick: () => void;
}

export interface DataTableProps {
  columns: Column[];
  data: RowData[];
  view?: TableView;
  dropdownActions?: DropdownAction[];
  itemsPerPage?: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusClassMap: Record<string, string> = {
    "Brak akceptacji": "badge warning",
    "Zakończona": "badge success",
    "Odrzucona": "badge danger",
    "W trakcie": "badge info",
  };
  return <span className={statusClassMap[status] || "badge"}>{status}</span>;
};

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  view = "user",
  dropdownActions = [],
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [tableData, setTableData] = useState<RowData[]>(data);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageCount = Math.ceil(tableData.length / itemsPerPage);
  const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const allVisibleSelected = paginatedData.every(row => selectedRows.includes(row.id));
  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedRows(prev => prev.filter(id => !paginatedData.map(r => r.id).includes(id)));
    } else {
      setSelectedRows(prev => [...new Set([...prev, ...paginatedData.map(r => r.id)])]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  const handleDeleteRow = (id: number) => {
    setTableData(prev => prev.filter(row => row.id !== id));
    setSelectedRows(prev => prev.filter(rowId => rowId !== id));
  };

  const dropdownHandlers: DropdownAction[] = [
    {
      label: "Usuń zaznaczone",
      onClick: () => {
        setTableData(prev => prev.filter(row => !selectedRows.includes(row.id)));
        setSelectedRows([]);
      }
    },
    {
      label: "Usuń wszystkie",
      onClick: () => {
        setTableData([]);
        setSelectedRows([]);
      }
    }
  ];

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="checkbox"
                checked={paginatedData.length > 0 && allVisibleSelected}
                onChange={toggleAllVisible}
              />
            </th>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleSelectRow(row.id)}
                />
              </td>
              {columns
  .filter(col => col.key !== "actions")
  .map(col => (
    <td key={col.key}>
      {col.key === "status" ? (
        <StatusBadge status={row[col.key]} />
      ) : col.render ? col.render(row) : row[col.key]}
    </td>
))}

{columns.some(col => col.key === "actions") && (
  <td>
    <div className="actions">
      <button className="button" onClick={() => alert(`Edit ID: ${row.id}`)}>✏️</button>
      <button className="button" onClick={() => handleDeleteRow(row.id)}>🗑️</button>
    </div>
  </td>
)}

            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className={styles.pagination_zgloszenia}>
        <button className={styles.pageButton_zgloszenia} disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
          <i className="fa-solid fa-angles-left"></i>
        </button>
        <button className={styles.pageButton_zgloszenia} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
          {windowWidth > 470 ? "Poprzedni" : <i className="fa-solid fa-chevron-left"></i>}
        </button>
        {[...Array(pageCount)].map((_, i) => (
          <button
            key={i + 1}
            className={`${styles.pageButton_zgloszenia} ${currentPage === i + 1 ? styles.active_zgloszenia : ''}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button className={styles.pageButton_zgloszenia} disabled={currentPage === pageCount} onClick={() => setCurrentPage(p => p + 1)}>
          {windowWidth > 470 ? "Następny" : <i className="fa-solid fa-chevron-right"></i>}
        </button>
        <button className={styles.pageButton_zgloszenia} disabled={currentPage === pageCount} onClick={() => setCurrentPage(pageCount)}>
          <i className="fa-solid fa-angles-right"></i>
        </button>
      </div>

      {view === "admin" && dropdownHandlers.length > 0 && (
        <div className={styles.massActionContainer}>
          <select className={styles.massActionSelect} defaultValue="" id="dropdown-action">
            <option value="" disabled>Wybierz akcję</option>
            {dropdownHandlers.map((action, index) => (
              <option key={index} value={index}>{action.label}</option>
            ))}
          </select>
          <button
            className={styles.zastosujButton}
            onClick={() => {
              const select = document.getElementById("dropdown-action") as HTMLSelectElement;
              const index = parseInt(select.value);
              if (!isNaN(index)) dropdownHandlers[index].onClick();
            }}
          >
            Zastosuj
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
