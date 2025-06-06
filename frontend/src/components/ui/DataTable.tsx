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
  onClick?: () => void;
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
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editedStatus, setEditedStatus] = useState<Record<number, string>>({});

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

  const handleEditRow = (id: number) => {
    setEditingRowId(id);
    const row = tableData.find(r => r.id === id);
    if (row) {
      setEditedStatus(prev => ({ ...prev, [id]: row.status }));
    }
  };

  const handleSubmitRow = async (id: number) => {
    const newStatus = editedStatus[id];
    const oldRow = tableData.find(row => row.id === id);

    if (!oldRow || oldRow.status === newStatus) {
      setEditingRowId(null);
      return;
    }

    try {
      await fetch(`/api/update-status/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setTableData(prev =>
        prev.map(row =>
          row.id === id ? { ...row, status: newStatus } : row
        )
      );
      setEditingRowId(null);
    } catch (error) {
      console.error("Błąd aktualizacji:", error);
      alert("Nie udało się zaktualizować statusu.");
    }
  };

  const getActionHandler = (label: string): (() => void) | undefined => {
    switch (label) {
      case "Usuń zaznaczone":
        return () => {
          setTableData(prev => prev.filter(row => !selectedRows.includes(row.id)));
          setSelectedRows([]);
        };
      case "Usuń wszystkie":
        return () => {
          setTableData([]);
          setSelectedRows([]);
        };
      default:
        return undefined;
    }
  };

  const resolvedActions: DropdownAction[] = dropdownActions
    .map(action => ({
      ...action,
      onClick: action.onClick || getActionHandler(action.label),
    }))
    .filter(action => typeof action.onClick === "function");

  return (
    <div className="table-container">
      <table className="dataTable_custom">
        <thead className="dataTable_thead">
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
                    {col.key === "status" && editingRowId === row.id ? (
                      <select
                        value={editedStatus[row.id]}
                        onChange={(e) =>
                          setEditedStatus(prev => ({
                            ...prev,
                            [row.id]: e.target.value,
                          }))
                        }
                        className="select_editRow"
                      >
                        <option value="Brak akceptacji">Brak akceptacji</option>
                        <option value="W trakcie">W trakcie</option>
                        <option value="Zakończona">Zakończona</option>
                        <option value="Odrzucona">Odrzucona</option>
                      </select>
                    ) : col.key === "status" ? (
                      <StatusBadge status={row[col.key]} />
                    ) : col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              {columns.some(col => col.key === "actions") && (
                <td>
                  <div className="actions_row">
                    {editingRowId === row.id ? (
                      <button className="buttonRow_submit" onClick={() => handleSubmitRow(row.id)}><i className="fa-solid fa-check-to-slot"></i></button>
                    ) : (
                      <button className="buttonRow_edit" onClick={() => handleEditRow(row.id)}><i className="fa-solid fa-pen-to-square"></i></button>
                    )}
                    <button className="buttonRow_delete" onClick={() => handleDeleteRow(row.id)}><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={styles.pagination_zgloszenia}>
        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          <i className="fa-solid fa-angles-left"></i>
        </button>
        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          {windowWidth > 470 ? 'Poprzedni' : <i className="fa-solid fa-chevron-left"></i>}
        </button>

        {(() => {
          const pages = [];
          if (pageCount <= 5) {
            for (let i = 1; i <= pageCount; i++) {
              pages.push(
                <button
                  key={i}
                  className={`${styles.pageButton_zgloszenia} ${
                    currentPage === i ? styles.active_zgloszenia : ''
                  }`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </button>
              );
            }
          } else {
            pages.push(
              <button
                key={1}
                className={`${styles.pageButton_zgloszenia} ${
                  currentPage === 1 ? styles.active_zgloszenia : ''
                }`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
            );

            if (currentPage > 3) {
              pages.push(<span key="dots-start">...</span>);
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(pageCount - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  className={`${styles.pageButton_zgloszenia} ${
                    currentPage === i ? styles.active_zgloszenia : ''
                  }`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </button>
              );
            }

            if (currentPage < pageCount - 2) {
              pages.push(<span key="dots-end">...</span>);
            }

            pages.push(
              <button
                key={pageCount}
                className={`${styles.pageButton_zgloszenia} ${
                  currentPage === pageCount ? styles.active_zgloszenia : ''
                }`}
                onClick={() => setCurrentPage(pageCount)}
              >
                {pageCount}
              </button>
            );
          }

          return pages;
        })()}

        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          {windowWidth > 470 ? 'Następny' : <i className="fa-solid fa-chevron-right"></i>}
        </button>
        <button
          className={styles.pageButton_zgloszenia}
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage(pageCount)}
        >
          <i className="fa-solid fa-angles-right"></i>
        </button>
      </div>

      {view === "admin" && resolvedActions.length > 0 && (
        <div className={styles.massActionContainer}>
          <select className={styles.massActionSelect} defaultValue="" id="dropdown-action">
            <option value="" disabled>Wybierz akcję</option>
            {resolvedActions.map((action, index) => (
              <option key={index} value={index}>{action.label}</option>
            ))}
          </select>
          <button
            className={styles.zastosujButton}
            onClick={() => {
              const select = document.getElementById("dropdown-action") as HTMLSelectElement;
              const index = parseInt(select.value);
              if (!isNaN(index)) resolvedActions[index].onClick?.();
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
