/**************************************************************************
 * In this Card component: We're using react-beautiful-dnd's Draggable    *
 * component to make the card draggable. We are also passing              *
 * the properties "draggableId " and "index" to a "Draggable".            *
 **************************************************************************/
import React, { useEffect } from 'react';
import {useState} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ConsutationDisplay from '../components/ConsutationDisplay.jsx'
import MenuItem from '@mui/material/MenuItem';
import { deleteConsultation } from '../utils/caseTaker.jsx';
import TicketMenu from '../components/TicketMenu.jsx';


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
  const [openDialog, setOpenDialog] = useState(false);
  const [tag, setTag] = useState(card.tag);
  const [showMenu,setShowMenu] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false);


  useEffect(() => {
  }, [isDeleted]);

  if (card == null || card.length === 0) {
    return <div>No cards.</div>;
  }

  if (isDeleted) {
    return null;
  }

  const showConsultationHandler = () => {
    setOpenDialog(true)
  }

  const closeConsultationHandler = () => {
    setOpenDialog(false)
  }

  const handleDeleteClick = async() => {
    const deleted = await deleteConsultation(card.consultation);
    if (deleted) {
      setIsDeleted(true);
      reduce_number_cards();
    }
  };

  return (
    <Draggable draggableId={String(card.consultation)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card style={{width: '15vw', margin: '0 auto' , position: 'relative'}} onDoubleClick={showConsultationHandler}>
            <CardContent
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <TicketMenu showMenu={showMenu}>
                <MenuItem onClick={handleDeleteClick}>Delete Consultation</MenuItem>
              </TicketMenu>
              <Typography color="textSecondary" gutterBottom>
                {tag}
              </Typography>
            </CardContent>
          </Card>
          <ConsutationDisplay consultation={card} open={openDialog} onClose={closeConsultationHandler} updateViewTag={setTag}/>
        </div>
      )}
    </Draggable>
  );
};

export default ConsultationTicket;
