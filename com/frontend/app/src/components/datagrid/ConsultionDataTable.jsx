import React from 'react';
import { DataGrid } from '@mui/x-data-grid';


/**
 * A React component that displays consultation data in a table using Material-UI DataGrid.
 *
 * @param {Object[]} data - An array of consultation data objects to be displayed in the table.
 * @returns {JSX.Element} The ConsultationDataTable component.
 */
const ConsultationDataTable = ({data}) => {

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, editable: false},
        { field: 'availability_state', headerName: 'Availability State', width: 150, editable: true },
        { field: 'progress_state', headerName: 'Progress State', width: 150, editable: true },
        { field: 'time_stamp', headerName: 'Time Stamp', width: 200, editable: true },
        { field: 'description', headerName: 'Description', width: 200, editable: true },
        { field: 'opponent', headerName: 'Opponent', width: 150, editable: true },
        { field: 'tag', headerName: 'Tag', width: 150, editable: true },
        { field: 'client', headerName: 'Client', width: 100, editable: true },
      ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}

      />
    </div>
  );
};

export default ConsultationDataTable;
