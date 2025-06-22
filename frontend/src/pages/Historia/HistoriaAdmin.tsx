import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/ui/DataTable";
import type {Column, RowData, DropdownAction} from "@components/ui/DataTable";
import { backend_url } from "@/src/main";
const HistoriaAdmin = async () => {
  const [rows, setRows] = useState<RowData[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        console.log(backend_url + "api/reservations/get_reservations");
        const response = await fetch(backend_url + "api/reservations/get_reservations");
        const data: RowData[] = await response.json();
        setRows(data);
      };
      fetchData();
    }, []);//Лера если хочешь можешь добавить фильтры для поиска и пагинации
  //page, pageSize,
  //completed, approved,
  //userId, itemId

  const columns: Column[] = [
    { key: "id", label: "Id/Imię" },
    { key: "type", label: "Typ" },
    {
      key: "item",
      label: "Do rezerwacji",
      render: (row) => (
        <p className="link_for_reservation_all">
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
      ),
    },
    { key: "unit", label: "Jednostka" },
    { key: "status", label: "Status rezerwacji" },
    { key: "termin_id", label: "Termin rezerwacji" },
    { key: "actions", label: "Akcje" },
  ];

  const dropdownActions: DropdownAction[] = [
    { label: "Usuń zaznaczone" },
    { label: "Usuń wszystkie" },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={rows}
        view="admin"
        dropdownActions={dropdownActions}
        itemsPerPage={8}
      />
    </div>
  );
};

export default HistoriaAdmin;
