import React from 'react';
import BaseGrid  from './BaseGrid';
import {
  createConsultationByDict,
  deleteConsultation,
  updateConsultation
} from '../../utils/caseTaker';

/**
 * A React component that displays consultation data in a table using Material-UI DataGrid.
 *
 * @param {Object[]} data - An array of consultation data objects to be displayed in the table.
 * @returns {JSX.Element} The ConsultationDataTable component.
 */
const ConsultationDataTable = ({data}) => {

    const formatConsultation = (ConsultationData) => {

      return ConsultationData;
    };

    const columns = [
        { field: 'id', 'type': 'number', headerName: 'ID', width: 70, editable: false},
        {
          field: 'availability_state', headerName: 'Availability State', width: 150, editable: true,
          type: 'singleSelect',
          valueOptions: [
            {value: 'CREATED', label: 'Unassigned Created'},
            {value: 'PENDING', label: 'Pending Assignment Request'},
            {value: 'ASSIGNED', label: 'Assigned'},
            {value: 'REJECTED', label: 'Unassigned Rejected'},
            {value: 'ARCHIVED', label: 'Archived'},
          ]
        },
        {
          field: 'progress_state', headerName: 'Progress State', width: 150, editable: true,
          type: 'singleSelect',
          valueOptions: [
            {value: 'TODO', label: 'To Do'},
            {value: 'IN_PROGRESS', label: 'In Progress'},
            {value: 'DONE', label: 'Done'},
            {value: 'PAUSED', label: 'Paused'},
            {value: 'BLOCKED', label: 'Blocked'},
            {value: 'INCOMPLETE', label: 'Incomplete'},
          ]
        },
        { field: 'time_stamp', headerName: 'Time Stamp', width: 200, editable: false,
          type: 'dateTime',
          valueGetter: ({ value }) => value && new Date(value),
        },
        { field: 'description', headerName: 'Description', width: 200, editable: true },
        { field: 'opponent', headerName: 'Opponent', width: 150, editable: true },
        { field: 'tag', headerName: 'Tag', width: 150, editable: true },
        { field: 'client','type': 'number', headerName: 'Client', width: 100, editable: true }, //todo: solo editable en isNew. podes crear array con campos editables en new y cambiar el estado dentro de baseGrid
      ];

  return (
    <div>
      <BaseGrid
        initialRows={data}
        columns={columns}
        emptyRecord={[]}
        onUpdateRow={updateConsultation}
        onDeleteRow={deleteConsultation}
        onCreateRow={createConsultationByDict}
        formatDataRow={formatConsultation}

      />
    </div>
  );
};

export default ConsultationDataTable;
