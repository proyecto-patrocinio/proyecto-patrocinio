import { Alert, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from "@mui/material";
import SimpleDialog from "./SimpleDialog";
import React, { useEffect, useState} from 'react';
import { getConsultation, updateConsultationField } from "../utils/caseTaker";
import { deleteCard } from "../utils/card";
import InfoIcon from '@mui/icons-material/Info';

/**
 * Component that displays a confirmation dialog for deleting a card.
 *
 * @param {object} props - Component properties.
 * @param {string} props.idCard - The ID of the card to be deleted.
 * @param {function} props.setOpen - Function to set the deletion state.
 * @param {boolean} props.isOpen - Indicates whether the confirmation dialog is visible.
 * @returns {JSX.Element} The JSX component that displays the delete confirmation dialog.
 */
export default function ConfirmDeleteDialog ({idCard, deleteViewCard, isOpen, setOpen}){
  const [updateViewCounter, setUpdateViewCounter] = useState(0); // Force update View
  const [error, setError] = useState("");
  const availableOptions = ['ARCHIVED', 'REJECTED'];
  const progressOptions = ['DONE','INCOMPLETE'];
  const [editedFields, setEditedFields] = useState({
    "progress_state": "",
    "availability_state": "",
  });

  const optionDict = {
    "ARCHIVED": "Archivado",
    "REJECTED": "Rechazado",
    "DONE": "Terminado",
    "INCOMPLETE": "Incompleto"
  }

  useEffect(() => {
    const updateData = async() => {
      const consult = await getConsultation(idCard);
      const isProgressValid = progressOptions.includes(consult.progress_state);
      const isAvailableValid = availableOptions.includes(consult.availability_state);
      if (!isProgressValid){
        consult.progress_state = progressOptions[0];
      }
      if(!isAvailableValid){
        consult.availability_state = availableOptions[0];
      }
      const values = {
        "progress_state": consult.progress_state,
        "availability_state": consult.availability_state,
      };
      setEditedFields(values);
    };
    updateData();

  // eslint-disable-next-line
  }, [idCard]);

  /**
   * Handles the confirmation of card deletion.
   */
  const handleConfirmDelete = async() => {

    try{
      await updateConsultationField(idCard, "progress_state", editedFields.progress_state);
      await updateConsultationField(idCard, "availability_state", editedFields.availability_state);
      await deleteCard(idCard);
      deleteViewCard();
    } catch (error){
      setError(error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };


  /**
   * Handles changes in form fields.
   *
   * @param {object} event - The event object.
   * @param {string} fieldKey - The key of the field being changed.
   */
  const handleOnChange = (event, fieldKey) => {
    const newValue = event.target.value;
    editedFields[fieldKey] = newValue
    setEditedFields(editedFields);
    setUpdateViewCounter(updateViewCounter + 1);
  };


  return (
    <SimpleDialog
      title={"Eliminar tarjeta"}
      description={"Confirmar eliminar tarjeta."}
      isOpen={isOpen}
      onClose={()=>{setOpen(false)}}
      onAccept={handleConfirmDelete}
    >
      <div elevation={3}>

      {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

      <TableContainer>
          <Table>
          <TableBody>

          {/* Progress Field */}
            <TableRow>
              <TableCell>
              Estado de progreso
              <Select
              value={editedFields.progress_state}
              onChange={(event)=>{handleOnChange(event,'progress_state')}}
              style={{ width: '100%' }}
              >
              {progressOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {optionDict[option] || option}
                </MenuItem>
              ))}
              </Select>
              </TableCell>
              <TableCell>
              <Tooltip color="primary" sx={{ml:1}} title={statesProgressDescription}>
                <InfoIcon/>
              </Tooltip>
              </TableCell>
            </TableRow>

          {/* Availability Field */}
            <TableRow>
              <TableCell>
              Estado de disponibilidad
              <Select
              value={editedFields.availability_state}
              onChange={(event)=>{handleOnChange(event,'availability_state')}}
              style={{ width: '100%' }}
              >
              {availableOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {optionDict[option] || option}
                </MenuItem>
              ))}
              </Select>
              </TableCell>
              <TableCell>
              <Tooltip color="primary" sx={{ml:1}} title={statesAvailabilityDescription}>
                <InfoIcon/>
              </Tooltip>
              </TableCell>
            </TableRow>


          </TableBody>
          </Table>
      </TableContainer>
      </div>
    </SimpleDialog>
  );
};

const statesAvailabilityDescription = `
ARCHIVADO: Se usa para elementos que ya no están activos o relevantes en el contexto actual, pero han sido archivados para referencia futura o registro histórico.
RECHAZADO: La tarea o solicitud ha sido rechazada o no aprobada por alguna razón y necesita ser revisada para ser reasignada o evaluada por los responsables de casos.
`;

const statesProgressDescription = `
COMPLETADO: La tarea ha sido completada con éxito y se ha logrado el objetivo previsto.
INCOMPLETO: La tarea aún no ha sido completada completamente o ha progresado pero no ha alcanzado el estado de "completado".
`;
