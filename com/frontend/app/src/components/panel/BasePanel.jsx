/*********************************************************************************
* In this component, we are using the Droppable component                          *
* from react-beautiful-dnd to make the panel a drop zone for drag and drop cards.  *
* We are also passing the droppableId and index properties to Droppable.           *
* Also, we are using the CustomCard component to render each card within the panel.*
***********************************************************************************/
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Grid from '@mui/material/Grid';
import { Paper } from '@mui/material';


/**
 * BasePanel is a component that represents a panel in an application.
 *
 * @param {Object} panel - The object containing information about the panel, including its title and content.
 * @param {number} index - The index of the panel in the list of panels.
 * @param {ReactNode} title - The component representing the panel's title.
 * @param {ReactNode} children - The nested content to be rendered as the list of cards within the panel.
* @returns {JSX.Element} - A JSX element representing the panel.
 */
const BasePanel = ({ panel, index, title, children }) => {

  const panelStyle = {
    backgroundColor: panel.id === 0 ? '#87cefaab' : 'lightskyblue',
    textAlign: 'center',
    height: '75vh',
    width: '20vw',
    minWidth: '200px',
  };

  const placeholderStyle = {
    width: '20vw',
    backgroundColor: '#d7f0fa' ,
    flexDirection: 'column',
    margin: '0 auto',
    minWidth: '200px',
  }

  if (!panel) {
    return <div>No panels.</div>;
  }

  return (
    <Droppable key={"droppeable-panel-"+String(panel.id)} droppableId={String(panel.id)} index={index} direction="vertical">
      {(provided) => (
        <Paper ref={provided.innerRef} {...provided.droppableProps}  style={panelStyle}>
            {title}
            <Grid container  columns={12} spacing={2} style={placeholderStyle} >
                {children}
                {provided.placeholder}
            </Grid>
        </Paper>
      )}
    </Droppable>
  );
};


export default BasePanel;
