import React from 'react';
import Grid from '@mui/material/Grid';
import TitlePanel from '../components/panel/TitlePanel';
import BasePanel from '../components/panel/BasePanel';
import InputRequestTicket from './InputRequestTicket';
import { IconButton } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';


/**
 * InputRequestPanel is a component that represents a panel containing input request tickets.
 *
 * @param {Object} panel - The object containing information about the panel, including its title and tickets.
 * @param {number} index - The index of the panel in the list of panels.
 * @returns {JSX.Element} - A JSX element representing the panel with input request tickets.
 */
const InputRequestPanel = ({ panel, index }) => {
  const [isFirstPanelPinned, setIsFirstPanelPinned] = React.useState(true);
  const [style, setStyle] = React.useState({ position: "sticky", left: 0, zIndex: 1});

  const toggleFirstPanelPinning = () => {
    const isPinned = !isFirstPanelPinned;
    setIsFirstPanelPinned(isPinned);
    if(isPinned){
      setStyle({ position: "sticky", left: 0, zIndex: 1});
    } else {
      setStyle({ backgroundColor: "lightgray"});
    }
  };

  const title = (
      <>
      <IconButton onClick={toggleFirstPanelPinning}  size="small" color="primary">
      <PushPinIcon/>
      </IconButton>
      {TitlePanel({panel:panel})}
      </>
    )


  return (
    <div style={style}>
    <BasePanel panel={panel} index={index} title={title}>
      {panel.cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={11} key={card.consultation} >
          <InputRequestTicket card={card} index={index} key={card.consultation}/>
          </Grid>
      ))}
    </BasePanel>
    </div>
  );
};


export default InputRequestPanel;
