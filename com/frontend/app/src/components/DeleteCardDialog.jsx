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


  useEffect(() => {
    const updateData = async() => {
      const consult = await getConsultation(idCard);
      console.log(availableOptions)
      const isProgressValid = progressOptions.includes(consult.progress_state);
      const isAvailableValid = availableOptions.includes(consult.availability_state);
      console.log(isAvailableValid)
      if (!isProgressValid){
        consult.progress_state = progressOptions[0]
      }
      if(!isAvailableValid){
        consult.availability_state = availableOptions[0]
      }
      const values = {
        "progress_state": consult.progress_state,
        "availability_state": consult.availability_state,
      };
      setEditedFields(values);
    };
    updateData();
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
      title={"Delete Card"}
      description={"Confirm delete card."}
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
              Progress State
              <Select
              value={editedFields.progress_state}
              onChange={(event)=>{handleOnChange(event,'progress_state')}}
              style={{ width: '100%' }}
              >
              {progressOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
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
              Availability State
              <Select
              value={editedFields.availability_state}
              onChange={(event)=>{handleOnChange(event,'availability_state')}}
              style={{ width: '100%' }}
              >
              {availableOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
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
ARCHIVED: Used for elements that are no longer active or relevant in the current context, but have been archived for future reference or historical record.
REJECTED: Task or request has been rejected or not approved for some reason and needs to be reviewed for reassignment or evaluation by case takers.
`

const statesProgressDescription = `
DONE: Task has been successfully completed, and the intended goal has been achieved.
INCOMPLETE: Task has not yet been fully completed or has progressed but has not reached the "done" state.
`