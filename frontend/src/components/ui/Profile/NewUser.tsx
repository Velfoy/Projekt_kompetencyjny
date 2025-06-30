import React, { useEffect, useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import '@styles/components/NewUser.css';
import Overlay from '@components/layout/Overlay'; 
import DataTable from "@components/ui/DataTable";
import type {Column, RowData, DropdownAction} from "@components/ui/DataTable";
import type { TableView } from '@components/ui/DataTable';
import { backend_url } from '@/src/main';
  const token = localStorage.getItem('auth_token');

const NewUser=()=>{
    const {role } = useAuth();
    const [rows, setRows] = useState<RowData[]>([
        { id: 1, access:'user' },
        { id: 2,access:'admin' },
        { id: 3,access:'user' },
        { id: 4,access:'null'},
        { id: 5,access:'user' },
        { id: 6,access:'user'},
        { id: 7,access:'user' },
        { id: 8,access:'admin' },
        { id: 9,access:'user' },
        { id: 10,access:'user' },
        { id: 11,access:'null' },
        { id: 12,access:'user' },
        { id: 13,access:'user' },
        { id: 14,access:'null' },   
  ]);

  const columns: Column[] = [
    { key: "id", label: "Id/Imię" },
    { key: "access", label: "Poziom dostępu" },
    { key: "actions", label: "Akcje" },
  ];

  const dropdownActions: DropdownAction[] = [
    { label: "Usuń zaznaczone" },
    { label: "Usuń wszystkie" },
  ];
    const [success, setSuccess] = useState(false);
    useEffect(() => {
          const fetchData = async () => {
            const response = await fetch(backend_url + "api/admin/get_visitors", {method: 'GET',  
                        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}});
            const data: RowData[] = await response.json();
            setRows(data);
            };
            fetchData();
        }, []);
     return (
         <>
            <div className="new_post">
                <div className="explanation_header">
                    <p>Zarządzaj użytkownikiem</p>
                </div>
                <DataTable
                    columns={columns}
                    data={rows}
                    view={role}
                    dropdownActions={dropdownActions}
                    itemsPerPage={8}
                       timeDetails={[]}
                        timeDifficulty={''}
                />   
            </div>
            {success && <Overlay message="Nowy post został utworzony" />}
        </>
    );
}
export default NewUser;