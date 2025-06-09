import styles from '../../styles/pages/kalendarzuser.module.css';
import { Link } from 'react-router-dom';

import DataTable from "@components/ui/DataTable";
import type {Column, RowData, DropdownAction} from "@components/ui/DataTable";
const KalendarzUser = () => {
  const rows: RowData[] = [
    { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel" },
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel"},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", },
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta",},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma",},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta"},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma",},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", },
    
  ];

  const columns: Column[] = [
    { key: "id", label: "Id przedmiotu" },
    { key: "unit", label: "Jednostka" },
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
        view="user"
        dropdownActions={dropdownActions}
        itemsPerPage={8}
      />
    </div>
  );
};

export default KalendarzUser;