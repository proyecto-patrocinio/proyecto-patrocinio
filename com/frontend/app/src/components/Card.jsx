/*

in this Card component: We're using react-beautiful-dnd's Draggable 
component to make the card draggable. We are also passing 
the properties " draggableId " and "index" to a "Draggable".
*/
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const CustomCard = ({ card, index }) => {
  if (card == null || card.length === 0) {
    return <div>No cards.</div>;
  }
  return (
    <Draggable draggableId={String(card.consultation)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card>
            <CardContent >
              <Typography
                color="textSecondary"
                gutterBottom
              >
                {card.tag}
              </Typography>
              <Typography variant="body2" component="p">
                {card.consultation}
              </Typography>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default CustomCard;
