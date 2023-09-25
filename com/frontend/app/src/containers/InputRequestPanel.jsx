import React from 'react';
import Grid from '@mui/material/Grid';
import TitlePanel from '../components/TitlePanel';
import BasePanel from '../components/BasePanel';
import InputRequestTicket from './InputRequestTicket';


/**
 * InputRequestPanel is a component that represents a panel containing input request tickets.
 *
 * @param {Object} panel - The object containing information about the panel, including its title and tickets.
 * @param {number} index - The index of the panel in the list of panels.
 * @returns {JSX.Element} - A JSX element representing the panel with input request tickets.
 */
const InputRequestPanel = ({ panel, index }) => {
  const title = TitlePanel({panel:panel})
  return (
    <BasePanel panel={panel} index={index} title={title}>
      {panel.cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={11} key={card.consultation} >
          <InputRequestTicket card={card} index={index} key={card.consultation}/>
          </Grid>
      ))}
    </BasePanel>
  );
};


export default InputRequestPanel;
