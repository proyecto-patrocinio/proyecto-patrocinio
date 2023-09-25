import React from 'react';
import Grid from '@mui/material/Grid';
import CardTicket from './CardTicket';
import TitlePanel from '../components/TitlePanel';
import BasePanel from '../components/BasePanel';


/**
 * CardPanel component represents a panel within a board, displaying a title and a list of cards.
 *
 * @param {Object} panel - The panel object containing information about the panel, including its title and cards.
 * @param {number} index - The index of the panel within the board.
 * @returns {JSX.Element} - A React element representing the CardPanel.
 */
const CardPanel = ({ panel, index }) => {
  const title = TitlePanel({panel:panel, isEditable: true});

  return (
    <BasePanel panel={panel} index={index} title={title}>
                {panel.cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={11} key={card.consultation} >
                    <CardTicket card={card} index={index} key={card.consultation}/>
                    </Grid>
                ))}
    </BasePanel>
  );
};


export default CardPanel;
