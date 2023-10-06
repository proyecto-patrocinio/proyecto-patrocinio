import React from 'react';
import BaseGrid from './BaseGrid';


/**
 * A React component that displays client data in a table using Material-UI DataGrid.
 *
 * @param {Object[]} data - An array of client data objects to be displayed in the table.
 * @returns {JSX.Element} The ClientDataTable component.
 */
function ClientDataTable({ data }) {

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, editable: false},
    { field: 'postal', headerName: 'Postal', width: 100, editable: true },
    { field: 'address', headerName: 'Address', width: 150, editable: true },
    { field: 'marital_status', headerName: 'Marital Status', width: 130, editable: true },
    { field: 'housing_type', headerName: 'Housing Type', width: 150, editable: true },
    { field: 'studies', headerName: 'Education Level', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'id_type', headerName: 'ID Type', width: 150, editable: true },
    { field: 'id_number', headerName: 'ID Number', width: 180, editable: true },
    { field: 'first_name', headerName: 'First Name', width: 150, editable: true },
    { field: 'last_name', headerName: 'Last Name', width: 150, editable: true },
    { field: 'birth_date', headerName: 'Birth Date', width: 180, editable: true },
    { field: 'sex', headerName: 'Sex', width: 100, editable: true },
    { field: 'locality', headerName: 'Locality', width: 100, editable: true },
  ];


  return (
    <div>
      <BaseGrid
        initialRows={data}
        columns={columns}
        emptyRecord={[]}
      />
    </div>
  );
};

export default ClientDataTable;
