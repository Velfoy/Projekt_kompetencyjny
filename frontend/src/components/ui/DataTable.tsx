import React, { useState, useEffect } from "react";
import { href, Link, useLocation } from "react-router-dom";
import "@styles/components/DataTable.css";
import styles from "../../styles/pages/historiaadmin.module.css";
import type {DaySchedule} from '../../types/authTypes';
import ReservationTime from "@/src/components/ui/timeLogic/ReservationTime";
import { backend_url } from "@/src/main";

export interface Column {
  key: string;
  label: string;
  render?: (row: RowData) => React.ReactNode;
}

export interface RowData {
  [key: string]: any;
}

export type TableView = "admin" | "user"|null;

export interface DropdownAction {
  label: string;
  onClick?: () => void;
}

export interface DataTableProps {
  columns: Column[];
  data: RowData[];
  view: TableView;
  dropdownActions?: DropdownAction[];
  itemsPerPage?: number;
  timeDetails?:DaySchedule[];
  timeDifficulty:string;
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
  view ,
  dropdownActions = [],
  itemsPerPage = 5,
  timeDifficulty
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [tableData, setTableData] = useState<RowData[]>(data);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editedStatus, setEditedStatus] = useState<Record<number, string>>({});
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [timeWindow,setTimeWindow]=useState(false);
    const [editedFields, setEditedFields] = useState<Record<number, { status?: string; access?: string ;organization:string;}>>({});
  const token = localStorage.getItem('auth_token');
  const [timeDetails, setTimeDetails] = useState<DaySchedule[]>([
    { day: '02.03.2025', from: '10:00', to: '12:00' },
    { day: '09.03.2025', from: '10:00', to: '12:00' },
    { day: '16.03.2025', from: '10:00', to: '12:00' },
    { day: '30.03.2025', from: '10:00', to: '12:00' },
  ])
  const organizationsMock = [
  { id: 'org1', name: 'Organizacja A' },
  { id: 'org2', name: 'Organizacja B' },
  { id: 'org3', name: 'Organizacja C' },
];


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    setTableData(data);
  }, [data]);

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
    setEditedFields(prev => ({
      ...prev,
      [id]: {
        status: row.status,
        access: row.access,
        organization:row.organization,
      },
    }));
  }
};

const handleSubmitRow = async (id: number) => {
  const edited = editedFields[id];
  const oldRow = tableData.find(row => row.id === id);

  if (!oldRow || !edited) {
    setEditingRowId(null);
    return;
  }

  const statusChanged = edited.status && edited.status !== oldRow.status;
  const accessChanged = edited.access && edited.access !== oldRow.access;

  if (!statusChanged && !accessChanged) {
    setEditingRowId(null);
    return;
  }

  try {
    await fetch(`/api/update-row/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(statusChanged && { status: edited.status }),
        ...(accessChanged && { access: edited.access }),
      }),
    });

    setTableData(prev =>
      prev.map(row =>
        row.id === id
          ? {
              ...row,
              ...(statusChanged && { status: edited.status }),
              ...(accessChanged && { access: edited.access }),
            }
          : row
      )
    );

    setEditingRowId(null);
  } catch (error) {
    console.error("Błąd aktualizacji:", error);
    alert("Nie udało się zaktualizować wiersza.");
  }
};

  const getActionHandler = (label: string): (() => void) | undefined => {
    const location = useLocation();
    switch (label) {
      case "Usuń zaznaczone":
        return async () => {
          console.log(selectedRows);
          if (location.pathname == '/historia') {
            await fetch(backend_url + "api/admin/delete_reservations/", {method: 'DELETE', 
            body: JSON.stringify(selectedRows), 
              headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}})
            const response = await fetch(backend_url + "api/reservations/get_reservations", {method: 'GET', 
              headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
            const data: RowData[] = await response.json();
          }
          setTableData(data);
          setSelectedRows([]);
        };
      case "Usuń wszystkie":
        return async () => {
          console.log(selectedRows);
          if (location.pathname == '/historia') {
            await fetch(backend_url + "api/admin/delete_all_reservations/", {method: 'DELETE', 
              headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}})
            const response = await fetch(backend_url + "api/reservations/get_reservations", {method: 'GET', 
              headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
            const data: RowData[] = await response.json();
        }
          setTableData(data);
          setSelectedRows([]);
        };
      default:
        return undefined;
    }
  };
  const toggleRowExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
const columnKeys = columns.map(col => col.key);
const visibleColumns = columns.filter(col => {
  if (col.key === "id" || col.key === "name" || col.key === "actions") return true;
  if (col.key==="access" && columnKeys.includes("access")) return windowWidth > 1050;
  if (col.key === "type" && columnKeys.includes("type")) return windowWidth > 450;
  if (col.key === "item" && columnKeys.includes("item")) return windowWidth > 650;
  if (col.key === "unit" && columnKeys.includes("unit")) return windowWidth > 750;
  if (col.key === "status" && columnKeys.includes("status")) return windowWidth > 850;
    if (col.key === "organization" && columnKeys.includes("organization")) return windowWidth > 950;
  if (col.key === "termin_id" && columnKeys.includes("termin_id")) return windowWidth > 1050;

  return false;
});

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
            {visibleColumns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
       <tbody>
  {paginatedData.map((row) => (
    <React.Fragment key={row.id}>
      <tr>
        <td >
            <div className="dataTable_chevron">
                <input
            type="checkbox"
            className="checkbox"
            checked={selectedRows.includes(row.id)}
            onChange={() => handleSelectRow(row.id)}
          />
           <i 
                className={`fa-solid fa-chevron-${expandedRow === row.id ? 'down' : 'right'}`}
                onClick={() => toggleRowExpand(row.id)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
        </td>
        {visibleColumns
          .filter(col => col.key !== "actions")
          .map(col => (
            <td key={col.key}>
              {col.key === "status" && editingRowId === row.id ? (
                <select
                  value={editedFields[row.id]?.status ?? row.status}
                    onChange={(e) =>
                      setEditedFields(prev => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], status: e.target.value },
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
                <div>
                    <StatusBadge status={row[col.key]} />
                </div>
                
              ) : col.key==="termin_id"?(
                <button onClick={async () => {
                  const data = await fetch(backend_url + "api/reservations/get_timespans/" + row.termin_id);
                  setTimeDetails(await data.json());
                  setTimeWindow(true)
                  
                }} className="detailButton_historia">Zobacz szczegóły</button>
              ): col.key==="access"&& editingRowId === row.id?(
                <select
                   value={editedFields[row.id]?.access ?? row.access}
                    onChange={(e) =>
                      setEditedFields(prev => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], access: e.target.value },
                      }))
                    }
                  className="select_access"
                >
                  <option value="null"  disabled hidden>Wybierz poziom dostępu</option>
                  <option value="user">Użytkownik</option>
                  <option value="admin">Admin</option>
                </select>
              ): col.key==="organization"&& editingRowId === row.id?(
                <select
                   value={editedFields[row.id]?.organization ?? row.organization}
                    onChange={(e) =>
                      setEditedFields(prev => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], organization: e.target.value },
                      }))
                    }
                  className="select_access"
                >
                  <option value="">Wybierz organizację</option>
                {organizationsMock.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
                </select>
              ): 
               col.render ? col.render(row) : row[col.key]}
            </td>
          ))}
        {columns.some(col => col.key === "actions") && (
          <td>
            <div className="actions_row">
              {editingRowId === row.id ? (
                <button className="buttonRow_submit" onClick={() => handleSubmitRow(row.id)}>
                  <i className="fa-solid fa-check-to-slot"></i>
                </button>
              ) : (
                <button className="buttonRow_edit" onClick={() => handleEditRow(row.id)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              )}
              <button className="buttonRow_delete" onClick={() => handleDeleteRow(row.id)}>
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        )}
      </tr>

      {expandedRow === row.id && (
        <tr>
          <td colSpan={columns.length + 1}>
            <div className="expanded_details">
                  {(windowWidth <= 450 && columnKeys.includes("type"))&& (
                <div className="detail_row">
                  <span className="detail_label">Typ:</span>
                  <span>{row["type"]}</span>
                </div>
              )}
               {(windowWidth <= 1050 && columnKeys.includes("access"))&& (
                <div className="detail_row">
                  <span className="detail_label">Poziom dostępu:</span>
                  {editingRowId === row.id ? (
                    <select
                  value={editedFields[row.id]?.access ?? row.access}
                    onChange={(e) =>
                      setEditedFields(prev => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], access: e.target.value },
                      }))
                    }
                  className="select_access"
                >
                  <option value="null"  disabled hidden>Wybierz poziom dostępu</option>
                  <option value="user">Użytkownik</option>
                  <option value="admin">Admin</option>
                </select>
                  ):(
                    row["access"]
                  )}
                  
                </div>
              )}
              {(windowWidth <= 950 && columnKeys.includes("organization"))&& (
                <div className="detail_row">
                  <span className="detail_label">Organizacja:</span>
                  {editingRowId === row.id ? (
                    <select
                  value={editedFields[row.id]?.organization ?? row.organization}
                    onChange={(e) =>
                      setEditedFields(prev => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], organization: e.target.value },
                      }))
                    }
                  className="select_access"
                >
                    <option value="">Wybierz organizację</option>
                {organizationsMock.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
                </select>
                  ):(
                    row["organization"]
                  )}
                  
                </div>
              )}
              {(windowWidth <= 650&&columnKeys.includes("item")) && (
                <div className="detail_row">
                  <span className="detail_label">Do rezerwacji:</span>
                  <p className="link_for_reservation_all" style={{ width: "150px" }}>
                    <Link  to={`/itemReservation/${row.item_id}`}
                        className="link_for_reservation"
                    >
                        <span>{row.item}{" "}</span>
                    </Link>
                    <Link  to={`/itemReservation/${row.item_id}`}
                        className="link_for_reservation2"
                    >
                        <i className="fa-solid fa-circle-info infoItemIcon" style={{ marginLeft: "6px" }}></i>
                    </ Link>
                    </p>
                  
                </div>
              )}
                {(windowWidth <= 750&& columnKeys.includes("unit")) && (
                <div className="detail_row">
                  <span className="detail_label">Jednostka:</span>
                  <span>{row["unit"]}</span>
                </div>
              )}
               {(windowWidth <= 850&& columnKeys.includes("status")) && (
                <div className="detail_row">
                  <span className="detail_label">Status rezerwacji:</span>
                  {editingRowId === row.id ? (
                        <select
                        value={editedFields[row.id]?.status ?? row.status}
                        onChange={(e) =>
                          setEditedFields(prev => ({
                            ...prev,
                            [row.id]: { ...prev[row.id], status: e.target.value },
                          }))
                        }
                        className="select_editRow"
                        >
                        <option value="Brak akceptacji">Brak akceptacji</option>
                        <option value="W trakcie">W trakcie</option>
                        <option value="Zakończona">Zakończona</option>
                        <option value="Odrzucona">Odrzucona</option>
                        </select>
                        
                        
                    ) : (
                        <StatusBadge status={row["status"]} />
                    )
                }
                </div>
              )}
                 {(windowWidth <= 1050&&columnKeys.includes("termin_id")) && (
                <div className="detail_row">
                  <span className="detail_label">Termin rezerwacji:</span>
                   <button  onClick={async () => {
                  const data = await fetch(backend_url + "api/reservations/get_timespans/" + row.termin_id);
                  setTimeDetails(await data.json());
                  setTimeWindow(true)
                  
                }} className="detailButton_historia">Zobacz szczegóły</button>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
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
       {timeWindow && (
        <ReservationTime
          difficulty={timeDifficulty}
          schedule={timeDetails}
          onClose={() => setTimeWindow(false)}
        />
      )
      }
    </div>
  );
};

export default DataTable;
