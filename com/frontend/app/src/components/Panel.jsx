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
import { Paper, Badge } from '@mui/material';

const Panel = ({ panel, index }) => {

  const panelStyle = {
    backgroundColor: panel.id === 0 ? '#87cefaab' : 'lightskyblue',
    textAlign: 'center',
    height: '75vh',
    width: '20vw',
  };

  if (!panel) {
    return <div>No panels.</div>;
  }

  return (
    <Droppable droppableId={String(panel.id)} index={index} direction="vertical">
      {(provided) => (
        <Badge color="info" badgeContent={panel.number_cards !== 0? panel.number_cards : "0"}>
          <Paper ref={provided.innerRef} {...provided.droppableProps}  style={panelStyle}>
                <Title>{panel.title}</Title>
              <Grid container  columns={12} spacing={2}  style={{width: '20vw', backgroundColor: '#d7f0fa' , flexDirection: 'column', margin: '0 auto'}} >
                  {panel.cards.map((card, index) => (
                      <Grid item xs={12} sm={6} md={11} key={card.consultation} >
                      <CustomCard card={card} index={index} key={card.consultation}/>
                      </Grid>
                  ))}
                  {provided.placeholder}
              </Grid>
          </Paper>
        </Badge>
      )}
    </Droppable>
  );
};


export default Panel;
