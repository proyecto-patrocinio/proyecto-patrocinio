import React from 'react';
import BaseGrid  from './BaseGrid';
import {
  createConsultationByDict,
  deleteConsultation,
  updateConsultation
} from '../../utils/caseTaker';
import { getClientDNI2ID, getClientID2DNI } from '../../utils/tools';


/**
 * A React component that displays consultation data in a table using Material-UI DataGrid.
 *
 * @param {Object[]} data - An array of consultation data objects to be displayed in the table.
 * @returns {JSX.Element} The ConsultationDataTable component.
 */
const ConsultationDataTable = ({data}) => {
  const [clientDNI2ID, setClientDNI2ID] = React.useState([]);
  const [clientID2DNI, setClientID2DNI] = React.useState([]);


    React.useEffect(() => {
      const fetchConsultancy = async () => {
          const clientDNItoIdMapping = await getClientDNI2ID();
          setClientDNI2ID(clientDNItoIdMapping);
          const clientIDtoDNIMapping = await getClientID2DNI();
          setClientID2DNI(clientIDtoDNIMapping);
      };
  
      fetchConsultancy();
  
    }, []);

    /**
     * Handler to format the data row before sending update or create queries to the API.
     */
    const formatConsultation = (ConsultationData) => {
      let consultationFormatted = ConsultationData
      const formatID = clientDNI2ID[ConsultationData['client']];
      consultationFormatted.client = formatID;
      return consultationFormatted;
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
        { field: 'client','type': 'number', headerName: 'Client', width: 100, editable: true,
          valueGetter: ({ value }) => clientID2DNI[value],
        },
  ];

  /**
   * Investigates whether a cell is editable or not based on the custom rules established
   */
  const isCellEditable = (params) => {
    if((params.row.isNew !== true) && (params.field === "client")){
      // The Client field only can be writable when the consult is new.
      return false;
    };
    return params.colDef.editable;
  };

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
        isCellEditable={isCellEditable}
      />
    </div>
  );
};

export default ConsultationDataTable;
