import React from 'react';
import BaseGrid  from './BaseGrid';
import {
  createConsultationByDict,
  deleteConsultation,
  updateConsultation
} from '../../utils/caseTaker';
import { getClientDNI2ID, getClientID2DNI } from '../../utils/tools';
import ConsutationDisplay from '../consultation/display/ConsutationDisplay';
import { CONSULTANCY_GROUP_NAME, Notification } from '../../sockets/Notification';


/**
 * A React component that displays consultation data in a table using Material-UI DataGrid.
 *
 * @param {Object[]} data - An array of consultation data objects to be displayed in the table.
 * @returns {JSX.Element} The ConsultationDataTable component.
 */
const ConsultationDataTable = ({data}) => {
  const [clientDNI2ID, setClientDNI2ID] = React.useState([]);
  const [clientID2DNI, setClientID2DNI] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [consultationSelected, setConsultationSelected] = React.useState(null);

    React.useEffect(() => {
      const fetchConsultancy = async () => {
          const clientDNItoIdMapping = await getClientDNI2ID();
          setClientDNI2ID(clientDNItoIdMapping);
          const clientIDtoDNIMapping = await getClientID2DNI();
          setClientID2DNI(clientIDtoDNIMapping);
      };
  
      fetchConsultancy();
  
    }, []);


  const doubleClickConsultationHandler = (selected) => {
    const consultation = selected.row;
    consultation.consultation = consultation.id; // formatted
    setConsultationSelected(consultation);
    setOpenDialog(true);
  };

  const closeConsultationHandler = () => {
    setOpenDialog(false);
  };

    /**
     * Handler to format the data row before sending update or create queries to the API.
     */
    const formatConsultation = (ConsultationData) => {
      let consultationFormatted = ConsultationData
      const clientIDValue = String(ConsultationData['client']).toUpperCase()  // PASSPORT use Upper Case
      const formatID = clientDNI2ID[clientIDValue];
      consultationFormatted.client = formatID;
      return consultationFormatted;
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, editable: false},
        {
          field: 'availability_state', headerName: 'Estado de disponibilidad', width: 150, editable: true,
          type: 'singleSelect',
          valueOptions: [
            {value: 'CREATED', label: 'Creado sin asignar'},
            {value: 'PENDING', label: 'Solicitud de Asignación Pendiente'},
            {value: 'ASSIGNED', label: 'Asignado'},
            {value: 'REJECTED', label: 'Rechazado sin asignar'},
            {value: 'ARCHIVED', label: 'Archivado'},
          ]
        },
        {
          field: 'progress_state', headerName: 'Estado de progreso', width: 150, editable: true,
          type: 'singleSelect',
          valueOptions: [
            {value: 'TODO', label: 'Por Hacer'},
            {value: 'IN_PROGRESS', label: 'En Progreso'},
            {value: 'DONE', label: 'Terminado'},
            {value: 'PAUSED', label: 'Pausado'},
            {value: 'BLOCKED', label: 'Bloqueado'},
            {value: 'INCOMPLETE', label: 'Incompleto'},
          ]
        },
        { field: 'time_stamp', headerName: 'Creación', width: 200, editable: false,
          type: 'dateTime',
          valueGetter: ({ value }) => value && new Date(value),
        },
        { field: 'description', headerName: 'Descripción', width: 200, editable: true },
        { field: 'opponent', headerName: 'Oponente', width: 150, editable: true },
        { field: 'tag', headerName: 'Etiqueta', width: 150, editable: true },
        { field: 'client', headerName: 'Consultante', width: 100, editable: true,
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
        doubleClickHandler={doubleClickConsultationHandler}
      />
      <ConsutationDisplay consultation={consultationSelected} open={openDialog}
        onClose={closeConsultationHandler}/>
      <Notification channelName={CONSULTANCY_GROUP_NAME}/>
    </div>
  );
};

export default ConsultationDataTable;
