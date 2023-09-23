/*********************************************************************************
* In this component, we are using the Droppable component                          *
* from react-beautiful-dnd to make the panel a drop zone for drag and drop cards.  *
* We are also passing the droppableId and index properties to Droppable.           *
* Also, we are using the CustomCard component to render each card within the panel.*
***********************************************************************************/
import React, { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Grid from '@mui/material/Grid';
import { Paper } from '@mui/material';
import TitlePanel from '../components/TitlePanel';
import ConsultationTicket from './ConsultationTicket';


/**
 * ConsultationPanel component represents a panel within a consultancy board, displaying a title and a list of cards.
 *
 * @param {Object} panel - The panel object containing information about the panel, including its title and cards.
 * @param {number} index - The index of the panel within the consultancy board.
 * @returns {JSX.Element} - A React element representing the ConsultationPanel.
 */
const ConsultationPanel = ({ panel, index }) => {
  const [titleUpdateCount, setTitleUpdateCount] = useState(0); // force update view
  const [panelData, setPanelData] = useState(panel);

  useEffect(() => {
    setPanelData(panel);
  }, [panel]);

  const panelStyle = {
    backgroundColor: panel.id === 0 ? '#87cefaab' : 'lightskyblue',
    textAlign: 'center',
    height: '75vh',
    width: '20vw',
  };

  if (!panel) {
    return <div>No panels.</div>;
  }

  /**
   * Reduces the number of cards in the panel and updates the state.
   */
  const reduce_number_cards = () => {
    panelData.number_cards = panelData.number_cards - 1;
    setPanelData(panelData);
    setTitleUpdateCount(titleUpdateCount + 1);
  };

  return (
    <Droppable key={"droppeable-panel-"+String(panelData.id)} droppableId={String(panelData.id)} index={index} direction="vertical">
      {(provided) => (
        <Paper ref={provided.innerRef} {...provided.droppableProps}  style={panelStyle}>
            <TitlePanel panel={panelData}/>
            <Grid container  columns={12} spacing={2}  style={{width: '20vw', backgroundColor: '#d7f0fa' , flexDirection: 'column', margin: '0 auto'}} >
                {panelData.cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={11} key={card.consultation} >
                    <ConsultationTicket card={card} index={index} reduce_number_cards={reduce_number_cards} key={card.consultation}/>
                    </Grid>
                ))}
                {provided.placeholder}
            </Grid>
        </Paper>
      )}
    </Droppable>
  );
};


export default ConsultationPanel;
