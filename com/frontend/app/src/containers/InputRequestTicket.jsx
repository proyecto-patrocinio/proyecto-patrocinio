import React, { useEffect } from 'react';
import {useState} from 'react';
import TicketMenu from '../components/ticket/TicketMenu.jsx';
import { MenuItem } from '@mui/material';
import { rejectRequestConsult } from '../utils/board.jsx';
import BaseTicket from '../components/ticket/BaseTicket.jsx';


/**
 * InputRequestTicket is a component that represents a ticket with input request in Input Request Panel.
 *
 * @param {Object} card - The object containing information about the request consultation, including its tag and consultation details.
 * @param {number} index - The index of the card in the list of request consultation.
 * @returns {JSX.Element|null} - A JSX element representing the ticket card or null if the request is rejected.
 */
const InputRequestTicket = ({card,index}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
  }, [isRejected]);

  if(isRejected) {
    return null;
  }

  const handleRejectedClick = async() => {
    rejectRequestConsult(card.consultation).then((rejected) => {
      if (rejected) {
        setIsRejected(true);
      }
    })
  };

  const cardContentProps = {
    "onMouseEnter": () => setShowMenu(true),
    "onMouseLeave": () => setShowMenu(false)
  }

  return (
    <BaseTicket ticket={card} index={index} cardContentProps={cardContentProps}>
      <TicketMenu showMenu={showMenu}>
        <MenuItem onClick={handleRejectedClick}>Rejected</MenuItem>
      </TicketMenu>
    </BaseTicket>
  );
};

export default InputRequestTicket;
