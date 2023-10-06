import React from 'react';
import BaseTicket from '../components/ticket/BaseTicket.jsx';


/**
 * Request Card Component
 *
 * This component represents a custom card that can be dragged and displayed in a draggable list.
 * It displays information from the provided 'card' object, including a tag. It also supports opening
 * a consultation dialog on double click.
 *
 * @param {Object} card - The card object containing information to display.
 * @param {number} index - The index of the card in the list.
 * @returns {JSX.Element} - The JSX element representing the custom card.
 */
const RequestTicket = ({card,index}) => {
  return (
    <BaseTicket ticket={card} index={index}/>
  );
};

export default RequestTicket;
