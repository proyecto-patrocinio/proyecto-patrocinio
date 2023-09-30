/**************************************************************************
 * In this Card component: We're using react-beautiful-dnd's Draggable    *
 * component to make the card draggable. We are also passing              *
 * the properties "draggableId " and "index" to a "Draggable".            *
 **************************************************************************/
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ConsutationDisplay from '../components/ConsutationDisplay.jsx'
import BaseTicket from '../components/BaseTicket.jsx';
import TicketMenu from '../components/TicketMenu.jsx';
import { MenuItem } from '@mui/material';
import { deleteCard } from '../utils/card.jsx';


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
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
  }, [isDeleted]);

  if (isDeleted) {
    return null;
  }

  const handleDeleteClick = async() => {
    const deleted = await deleteCard(card.consultation);
    if (deleted) {
      setIsDeleted(true);
    }
  };

  const cardContentProps = {
    "onMouseEnter": ()=> setShowMenu(true),
    "onMouseLeave": ()=> setShowMenu(false)
  }

  return (
    <BaseTicket ticket={card} index={index} cardContentProps={cardContentProps}>
      <TicketMenu showMenu={showMenu}>
        <MenuItem onClick={handleDeleteClick}>Delete Card</MenuItem>
      </TicketMenu>
    </BaseTicket>
  );
};

export default CardTicket;
