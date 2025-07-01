import React, { useState } from "react";
interface Organization {
  id: string;
  name: string;
}

interface Row {
  id: number;
  organization: string;
}

interface Props {
  col: { key: string };
  editingRowId: number;
  row: Row;
  organizationsMock: Organization[];
  setEditedFields: React.Dispatch<
    React.SetStateAction<Record<number, { status?: string; access?: string; organization: string }>>
  >;
  editedFields: Record<number, { status?: string; access?: string; organization: string }>;
}

const OrganizationSelect: React.FC<Props> = ({
  col,
  editingRowId,
  row,
  organizationsMock,
  setEditedFields,
  editedFields,
}) => {
  const [selects, setSelects] = useState<{ id: number; value: string }[]>([
    { id: 0, value: row.organization ?? "" },
  ]);

  const chosenOrgs = selects.map((s) => s.value).filter(Boolean);

  const getOptionsForSelect = (selectValue: string) =>
    organizationsMock.filter(
      (org) => !chosenOrgs.includes(org.id) || org.id === selectValue
    );

  const handleSelectChange = (index: number, value: string) => {
    const newSelects = [...selects];
    newSelects[index].value = value;
    setSelects(newSelects);

    setEditedFields((prev) => ({
      ...prev,
      [row.id]: { ...prev[row.id], organization: newSelects[0].value },
    }));
  };

  const addSelect = () => {
    setSelects((prev) => [...prev, { id: prev.length, value: "" }]);
  };

  const canAddMore = organizationsMock.length > chosenOrgs.length;

  if (!(col.key === "organization" && editingRowId === row.id)) {
    return <>{row.organization}</>;
  }

  return (
    <div>
      {selects.map((selectItem, index) => (
        <div key={selectItem.id} style={{ marginBottom: "8px" }}>
          <select
            value={selectItem.value}
            onChange={(e) => handleSelectChange(index, e.target.value)}
            className="select_access"
          >
            <option value="">Wybierz organizację</option>
            {getOptionsForSelect(selectItem.value).map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          {index === selects.length - 1 && (
            <button
              type="button"
              onClick={addSelect}
              disabled={!canAddMore}
              style={{ marginLeft: "8px" }}
            >
              Dodaj kolejny
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrganizationSelect;
