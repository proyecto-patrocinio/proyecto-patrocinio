import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import CardTicket from './CardTicket';
import TitlePanel from '../components/TitlePanel';
import BasePanel from '../components/BasePanel';
import TicketMenu from '../components/TicketMenu';
import { MenuItem } from '@mui/material';
import { deletePanel } from '../utils/panel';


/**
 * CardPanel component represents a panel within a board, displaying a title and a list of cards.
 *
 * @param {Object} panel - The panel object containing information about the panel, including its title and cards.
 * @param {number} index - The index of the panel within the board.
 * @returns {JSX.Element} - A React element representing the CardPanel.
 */
const CardPanel = ({ panel, index }) => {
  const [showMenu, setShowMenu] = useState(false);
  const title = TitlePanel({panel:panel, isEditable: true});
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
  }, [isDeleted]);

  if(isDeleted) {
    return null;
  }

  const handleDeleteClick = () => {
    deletePanel(panel.id).then((deleted) => {
      if(deleted){
        setIsDeleted(true);
      }
    });
  };

  const menuComponent = (
    <div
      invisible={true}
      style={{
        position: 'absolute',
        top: '0',
        right: '0',
      }}
    >
      <TicketMenu showMenu={showMenu} key={"menu"}>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </TicketMenu>
    </div>
  );


  return (
    <div
      onMouseEnter={()=> setShowMenu(true)}
      onMouseLeave={()=> setShowMenu(false)}
      style={{position: 'relative'}}
      key={"title-panel"}
    >
        <BasePanel panel={panel} index={index} title={title}>
                    {panel.cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={11} key={card.consultation} >
                        <CardTicket card={card} index={index} key={card.consultation}/>
                        </Grid>
                    ))}
        </BasePanel>
        {menuComponent}
    </div>
  );
};


export default CardPanel;
