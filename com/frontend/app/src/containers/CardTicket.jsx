/**************************************************************************
 * In this Card component: We're using react-beautiful-dnd's Draggable    *
 * component to make the card draggable. We are also passing              *
 * the properties "draggableId " and "index" to a "Draggable".            *
 **************************************************************************/
import React, { useEffect } from 'react';
import { useState } from 'react';
import BaseTicket from '../components/BaseTicket.jsx';
import TicketMenu from '../components/TicketMenu.jsx';
import { MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { deleteCard } from '../utils/card.jsx';
import { getConsultation, updateConsultationField } from '../utils/caseTaker.jsx';
import SimpleDialog from '../components/SimpleDialog.jsx';


/**
 * Board Card Component
 *
 * This component represents a custom card that can be dragged and displayed in a draggable list.
 * It displays information from the provided 'card' object, including a tag. It also supports opening
 * a consultation dialog on double click.
 *
 * @param {Object} card - The card object containing information to display.
 * @param {number} index - The index of the card in the list.
 * @returns {JSX.Element} - The JSX element representing the custom card.
 */
const CardTicket = ({ card, index }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false);
  const [updateViewCounter, setUpdateViewCounter] = useState(0); // Force update View
  const [editedFields, setEditedFields] = useState({
    "progress_state": "",
    "availability_state": "",
  });
  const progressOptions = ['DONE','INCOMPLETE'];
  const availableOptions = ['ASSIGNED', 'ARCHIVED', 'REJECTED'];

  useEffect(() => {
    const updateData = async() => {
      const consult = await getConsultation(card.consultation);
      const isProgressValid = progressOptions.includes(consult.progress_state);
      const isAvailableValid = progressOptions.includes(consult.progress_state);
      if (!isProgressValid){
        consult.progress_state = progressOptions[0]
      }
      if(!isAvailableValid){
        consult.availablility = availableOptions[0]
      }
      const values = {
        "progress_state": consult.progress_state,
        "availability_state": consult.availability_state,
      };
      setEditedFields(values);
    };
    updateData();
  }, [card]);

  useEffect(() => {
  }, [isDeleted]);

  if (isDeleted) {
    return null;
  }

  const handleConfirmDelete = async() => {
    const id = card.consultation
    console.log(editedFields)
    await updateConsultationField(id, "progress_state", editedFields.progress_state);
    await updateConsultationField(id,"availability_state", editedFields.availability_state);
    const deleted = await deleteCard(id);
      if (deleted) {
        setIsDeleted(true);
      };
  };

  const cardContentProps = {
    "onMouseEnter": ()=> setShowMenu(true),
    "onMouseLeave": ()=> setShowMenu(false)
  }

  const handleOnChange = (event, fieldKey) => {
    const newValue = event.target.value;
    editedFields[fieldKey] = newValue
    setEditedFields(editedFields);
    setUpdateViewCounter(updateViewCounter + 1);
  };

const confirmDeleteDialog = (
  <SimpleDialog
    title={"Delete Card"}
    description={"Confirm delete card."}
    isOpen={showConfirm}
    onClose={()=>{setShowConfirm(false)}}
    onAccept={handleConfirmDelete}
  >
    <div elevation={3}>
    <TableContainer>
        <Table>
        <TableBody>
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
          </TableRow>
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
          </TableRow>
        </TableBody>
        </Table>
    </TableContainer>
    </div>
  </SimpleDialog>
);

  return (
    <div>
    <BaseTicket ticket={card} index={index} cardContentProps={cardContentProps}>
      <TicketMenu showMenu={showMenu}>
        <MenuItem onClick={() => {setShowConfirm(true)}}>Delete Card</MenuItem>
      </TicketMenu>
    </BaseTicket>
    {confirmDeleteDialog}
    </div>
  );
};

export default CardTicket;
