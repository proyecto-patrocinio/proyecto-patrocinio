/**************************************************************************
 * In this Card component: We're using react-beautiful-dnd's Draggable    *
 * component to make the card draggable. We are also passing              *
 * the properties "draggableId " and "index" to a "Draggable".            *
 **************************************************************************/
import React from 'react';
import {useState} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ConsutationDisplay from '../components/ConsutationDisplay.jsx'


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
  const [openDialog, setOpenDialog] = useState(false);
  const [tag, setTag] = useState(card.tag);

  if (card == null || card.length === 0) {
    return <div>No cards.</div>;
  }

  const showConsultationHandler = () => {
    setOpenDialog(true)
  }

  const closeConsultationHandler = () => {
    setOpenDialog(false)
  }

  return (
    <Draggable draggableId={String(card.consultation)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card style={{width: '15vw', margin: '0 auto' }} onDoubleClick={showConsultationHandler}>
            <CardContent>
              <Typography
                color="textSecondary"
                gutterBottom
              >
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

export default RequestTicket;
