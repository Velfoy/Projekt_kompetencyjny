import styles from '../../styles/pages/historiauser.module.css';
import DataTable from "@components/ui/DataTable";
import type {Column, RowData, DropdownAction} from "@components/ui/DataTable";
const HistoriaUser = () => {
  const rows: RowData[] = [
    { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji",termin_id:3 },
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona",termin_id:3 },
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
      { id: 1, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 2, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 3, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 4, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 5, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 6, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 7, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
     { id: 8, type: "Pokój", item: "p. 17", item_id: "5", unit: "Voxel", status: "Brak akceptacji" ,termin_id:3},
    { id: 9, type: "Sala", item: "s. 22", item_id: "6", unit: "Alpha", status: "Zakończona" ,termin_id:3},
    { id: 10, type: "Pokój", item: "p. 11", item_id: "7", unit: "Beta", status: "W trakcie" ,termin_id:3},
    { id: 11, type: "Sala", item: "s. 05", item_id: "8", unit: "Gamma", status: "Odrzucona" ,termin_id:3},
    { id: 12, type: "Pokój", item: "p. 02", item_id: "9", unit: "Delta", status: "Brak akceptacji" ,termin_id:3},
    { id: 13, type: "Sala", item: "s. 18", item_id: "10", unit: "Sigma", status: "W trakcie" ,termin_id:3},
    { id: 14, type: "Pokój", item: "p. 09", item_id: "11", unit: "Omega", status: "Zakończona" ,termin_id:3},
    
  ];

  const columns: Column[] = [
    { key: "id", label: "Id/Imię" },
    { key: "type", label: "Typ" },
    {
      key: "item",
      label: "Do rezerwacji",
      render: (row) => (
        <p className="link_for_reservation_all">
           <a
            href="https://www.miejski.pl/slowo-FFF"
            target="_blank"
            rel="noopener noreferrer"
            className="link_for_reservation"
          >
            <span>{row.item}{" "}</span>
          </a>
          <a
            href="https://www.miejski.pl/slowo-FFF"
            target="_blank"
            rel="noopener noreferrer"
            className="link_for_reservation2"
          >
            <i className="fa-solid fa-circle-info infoItemIcon" style={{ marginLeft: "6px" }}></i>
          </a>
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

export default HistoriaUser;
