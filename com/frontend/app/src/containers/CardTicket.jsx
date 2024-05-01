/**************************************************************************
 * In this Card component: We're using react-beautiful-dnd's Draggable    *
 * component to make the card draggable. We are also passing              *
 * the properties "draggableId " and "index" to a "Draggable".            *
 **************************************************************************/
import React, { useEffect } from 'react';
import { useState } from 'react';
import BaseTicket from '../components/ticket/BaseTicket.jsx';
import TicketMenu from '../components/ticket/TicketMenu.jsx';
import { MenuItem } from '@mui/material';
import DeleteCardDialog from '../components/DeleteCardDialog.jsx';

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

  useEffect(() => {
  }, [isDeleted]);

  if (isDeleted) {
    return null;
  }

  const cardContentProps = {
    "onMouseEnter": ()=> setShowMenu(true),
    "onMouseLeave": ()=> setShowMenu(false)
  }

  const deleteCardHandler = () => {
    setIsDeleted(true);
  }

  return (
    <div>
    <BaseTicket ticket={card} index={index} cardContentProps={cardContentProps}>
      <TicketMenu showMenu={showMenu}>
        <MenuItem onClick={() => {setShowConfirm(true)}}>Eliminar Consulta</MenuItem>
      </TicketMenu>
    </BaseTicket>
    <DeleteCardDialog
      idCard={card.consultation}
      isOpen={showConfirm}
      setOpen={setShowConfirm}
      deleteViewCard={deleteCardHandler}
    />
    </div>
  );
};

export default CardTicket;
