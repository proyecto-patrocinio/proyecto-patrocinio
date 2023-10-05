import React from 'react';
import { DataGrid } from '@mui/x-data-grid';


/**
 * A React component that displays client data in a table using Material-UI DataGrid.
 *
 * @param {Object[]} data - An array of client data objects to be displayed in the table.
 * @returns {JSX.Element} The ClientDataTable component.
 */
function ClientDataTable({ data }) {

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'postal', headerName: 'Postal', width: 100 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'marital_status', headerName: 'Marital Status', width: 130 },
    { field: 'housing_type', headerName: 'Housing Type', width: 150 },
    { field: 'studies', headerName: 'Education Level', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'id_type', headerName: 'ID Type', width: 150 },
    { field: 'id_number', headerName: 'ID Number', width: 180 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'birth_date', headerName: 'Birth Date', width: 180 },
    { field: 'sex', headerName: 'Sex', width: 100 },
    { field: 'locality', headerName: 'Locality', width: 100 },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5} // number of rows per page
        rowsPerPageOptions={[5, 10, 20]} // options for number of rows per page
      />
    </div>
  );
};

export default ClientDataTable;
