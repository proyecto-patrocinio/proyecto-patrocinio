import React from 'react';
import Grid from '@mui/material/Grid';
import TitlePanel from '../components/panel/TitlePanel';
import RequestTicket from './RequestTicket';
import BasePanel from '../components/panel/BasePanel';


/**
 * RequestPanel component represents a panel within a consultancy board, displaying a title and a list of cards.
 *
 * @param {Object} panel - The panel object containing information about the panel, including its title and cards.
 * @param {number} index - The index of the panel within the consultancy board.
 * @returns {JSX.Element} - A React element representing the RequestPanel.
 */
const RequestPanel = ({ panel, index }) => {
  const title = TitlePanel({panel:panel})
  return (
    <BasePanel panel={panel} index={index} title={title}>
      {panel.cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={11} key={card.consultation} >
          <RequestTicket card={card} index={index} key={card.consultation}/>
          </Grid>
      ))}
    </BasePanel>
  );
};


export default RequestPanel;
