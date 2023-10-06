import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import TitlePanel from '../components/panel/TitlePanel';
import ConsultationTicket from './ConsultationTicket';
import BasePanel from '../components/panel/BasePanel';


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
  const title = TitlePanel({panel:panel});

  useEffect(() => {
    setPanelData(panel);
  }, [panel]);

  /**
   * Reduces the number of cards in the panel and updates the state.
   */
  const reduce_number_cards = () => {
    panelData.number_cards --;
    setPanelData(panelData);
    setTitleUpdateCount(titleUpdateCount + 1);
  };


  return (
    <BasePanel panel={panel} index={index} title={title}>
      {panelData.cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={11} key={card.consultation} >
          <ConsultationTicket card={card} index={index} reduce_number_cards={reduce_number_cards} key={card.consultation}/>
          </Grid>
      ))}
    </BasePanel>
  );
};


export default ConsultationPanel;
