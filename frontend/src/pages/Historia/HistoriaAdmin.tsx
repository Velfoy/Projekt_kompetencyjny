import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/ui/DataTable";
import type {Column, RowData, DropdownAction} from "@components/ui/DataTable";
// import { backend_url } from "@/src/main";
import type {DaySchedule} from '../../types/authTypes';
import { backend_url } from "@/src/main";
const HistoriaAdmin = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(backend_url + "api/reservations/get_reservations");
        const data: RowData[] = await response.json();
        setRows(data);
      };
      fetchData();
    }, []);
    console.log(rows);
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
    ];
  
    const dropdownActions: DropdownAction[] = [
      { label: "Usuń zaznaczone" },
      { label: "Usuń wszystkie" },
    ];
    //???????
    const mockTime:DaySchedule[]=[
      { day: '02.03.2025', from: '10:00', to: '12:00' },
      { day: '09.03.2025', from: '10:00', to: '12:00' },
      { day: '16.03.2025', from: '10:00', to: '12:00' },
      { day: '30.03.2025', from: '10:00', to: '12:00' },
    ]
    //???????
    const mockDifficulty:string="difficult";

  return (
    <div>
      <DataTable
        columns={columns}
        data={rows}
        view="admin"
        dropdownActions={dropdownActions}
        itemsPerPage={8}
        timeDetails={mockTime}
        timeDifficulty={mockDifficulty}
      />
     
    </div>
  );
};

export default HistoriaAdmin;
