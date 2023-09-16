/*

in this Card component: We're using react-beautiful-dnd's Draggable 
component to make the card draggable. We are also passing 
the properties " draggableId " and "index" to a "Draggable".
*/
import React from 'react';
import {useState} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ConsutationDisplay from '../components/ConsutationDisplay.jsx'


const CustomCard = ({ card, index }) => {
  const [openDialog, setOpenDialog] = useState(false);

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
                {card.tag}
              </Typography>
            </CardContent>
          </Card>
          <ConsutationDisplay consultation={card} open={openDialog} onClose={closeConsultationHandler}/>
        </div>
      )}
    </Draggable>
  );
};

export default CustomCard;