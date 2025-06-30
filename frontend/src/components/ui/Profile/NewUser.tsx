import React, { useEffect, useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import '@styles/components/NewUser.css';
import Overlay from '@components/layout/Overlay'; 
import DataTable from "@components/ui/DataTable";
import type { Column, RowData, DropdownAction } from "@components/ui/DataTable";
import type { FormEvent, ChangeEvent } from 'react';

interface NewUserData {
  email: string;
  name: string;
  userrole: 'admin' | 'user' | null;
  organization: string;
}
const organizationsMock = [
  { id: 'org1', name: 'Organizacja A' },
  { id: 'org2', name: 'Organizacja B' },
  { id: 'org3', name: 'Organizacja C' },
];

const NewUser = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userrole, setUserrole] = useState<'admin' | 'user' | null>(null);
  const [organization, setOrganization] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!email.trim() || !name.trim() || !organization.trim() || !userrole) return;

    const newUser: NewUserData = { email, name, userrole, organization };

    try {
      console.log('Sending post to server:', newUser);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate request

      setSuccess(true);
      setEmail('');
      setName('');
      setUserrole(null);
      setOrganization('');
      setSubmitted(false);

      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const { role } = useAuth();

  const rows: RowData[] = [
    { id: 1, access: 'user' },
    { id: 2, access: 'admin' },
    { id: 3, access: 'user' },
    { id: 4, access: 'null' },
    { id: 5, access: 'user' },
    { id: 6, access: 'user' },
    { id: 7, access: 'user' },
    { id: 8, access: 'admin' },
    { id: 9, access: 'user' },
    { id: 10, access: 'user' },
    { id: 11, access: 'null' },
    { id: 12, access: 'user' },
    { id: 13, access: 'user' },
    { id: 14, access: 'null' },
  ];
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
        <div className="explanation_header">
          <p>Stwórz nowego użytkownika</p>
        </div>
        <div className="creating_newpost">
          <form onSubmit={handleSubmit} className={submitted ? 'submitted' : ''} noValidate>
            <div className="info_andbutton">
                <div className='column_div'>
                <input
                    type="email"
                    className="post_title"
                    placeholder="Email usera"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                />
                   <select
                className="post_title"
                value={organization}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setOrganization(e.target.value)}
                required
              >
                <option value="">Wybierz organizację</option>
                {organizationsMock.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
                
                </div>
              <div className='column_div'>
                <input
                    className="post_title"
                    placeholder="Imię usera"
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    required
                />
             
              <select
                className="post_title"
                value={userrole ?? ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setUserrole(e.target.value === '' ? null : (e.target.value as 'admin' | 'user'))
                }
                required
              >
                <option value="">Wybierz rolę użytkownika</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              </div>
              
              
              <button type="submit" className="post_create">
                Stwórz
              </button>
            </div>
          </form>
        </div>
      </div>
      {success && <Overlay message="Nowy post został utworzony" />}
    </>
  );
};

export default NewUser;
