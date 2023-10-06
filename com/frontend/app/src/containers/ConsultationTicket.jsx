import React, { useEffect } from 'react';
import {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import { deleteConsultation } from '../utils/caseTaker.jsx';
import TicketMenu from '../components/ticket/TicketMenu.jsx';
import BaseTicket from '../components/ticket/BaseTicket.jsx';


/**
 * Consultancy Card Component
 *
 * This component represents a custom card that can be dragged and displayed in a draggable list.
 * It displays information from the provided 'card' object, including a tag. It also supports opening
 * a consultation dialog on double click.
 *
 * @param {Object} card - The card object containing information to display.
 * @param {number} index - The index of the card in the list.
 * @param {function} callback - Update Panel View with the new number of cards.
 * @returns {JSX.Element} - The JSX element representing the custom card.
 */
const ConsultationTicket = ({card, index, reduce_number_cards}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false);


  useEffect(() => {
  }, [isDeleted]);

  if (isDeleted) {
    return null;
  }

  const handleDeleteClick = async() => {
    const deleted = await deleteConsultation(card.consultation);
    if (deleted) {
      setIsDeleted(true);
      reduce_number_cards();
    }
  };

    const cardContentProps = {
      "onMouseEnter": ()=> setShowMenu(true),
      "onMouseLeave": ()=> setShowMenu(false)
    }

  return (
    <BaseTicket ticket={card} index={index} cardContentProps={cardContentProps}>
      <TicketMenu showMenu={showMenu}>
        <MenuItem onClick={handleDeleteClick}>Delete Consultation</MenuItem>
      </TicketMenu>
    </BaseTicket>
  );
};

export default ConsultationTicket;
