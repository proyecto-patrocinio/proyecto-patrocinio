/*********************************************************************************
* In this component, we are using the Droppable component                          *
* from react-beautiful-dnd to make the panel a drop zone for drag and drop cards.  *
* We are also passing the droppableId and index properties to Droppable.           *
* Also, we are using the CustomCard component to render each card within the panel.*
***********************************************************************************/
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Grid from '@mui/material/Grid';
import CustomCard from './Card';
import Title from './Title';
import { Paper } from '@mui/material';

const Panel = ({ panel, index }) => {
  if (!panel) {
    return <div>No panels.</div>;
  }

  return (
    <Droppable droppableId={String(panel.id)} index={index} direction="vertical">
      {(provided) => (
        <Paper ref={provided.innerRef} {...provided.droppableProps}  style={{  backgroundColor: 'lightskyblue' , textAlign: 'center'}}>
            <Title>{panel.title}</Title>
            <Grid container  columns={12} spacing={2}  style={{  width: '200px',backgroundColor: '#d7f0fa' , flexDirection: 'column', margin: '0 auto'}} >
                {panel.cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={11} key={card.id} >
                    <CustomCard card={card} index={index} key={card.id}/>
                    </Grid>
                ))}
                {provided.placeholder}
            </Grid>
        </Paper>
      )}
    </Droppable>
  );
};


export default Panel;
