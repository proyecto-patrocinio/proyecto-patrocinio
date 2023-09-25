import React from 'react';
import Grid from '@mui/material/Grid';
import TitlePanel from '../components/TitlePanel';
import BasePanel from '../components/BasePanel';
import InputRequestTicket from './InputRequestTicket';


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
