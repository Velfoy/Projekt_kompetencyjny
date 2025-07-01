import React, { useState } from "react";
interface Organization {
  id: string;
  name: string;
}
interface Row {
  id: number;
  organizations: string[];  // tablica id organizacji
}

interface Props {
  col: { key: string };
  editingRowId: number;
  row: Row;
  organizationsMock: Organization[];
  setEditedFields: React.Dispatch<
    React.SetStateAction<
      Record<number, { status?: string; access?: string; organizations?: string[] }>
    >
  >;
  editedFields: Record<number, { status?: string; access?: string; organizations?: string[] }>;
}
const OrganizationSelect: React.FC<Props> = ({
  col,
  editingRowId,
  row,
  organizationsMock,
  setEditedFields,
  editedFields,
}) => {
  // Pobieramy aktualny wybór organizacji
  const selectedOrgs = editedFields[row.id]?.organizations ?? row.organizations ?? [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const values: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setEditedFields(prev => ({
      ...prev,
      [row.id]: {
        ...prev[row.id],
        organizations: values,
      },
    }));
  };

  if (!(col.key === "organizations" && editingRowId === row.id)) {
    const orgNames = row.organizations
      ?.map((orgId) => organizationsMock.find((org) => org.id === orgId)?.name)
      .filter(Boolean)
      .join(", ");
    return <>{orgNames ?? ""}</>;
  }

  return (
    <select
      multiple
      value={selectedOrgs}
      onChange={handleChange}
      style={{ minWidth: 200, height: 100 }}
      className="select_multiple"
    >
      {organizationsMock.map((org) => (
        <option key={org.id} value={org.name}>
          {org.name}
        </option>
      ))}
    </select>
  );
};


export default OrganizationSelect;
