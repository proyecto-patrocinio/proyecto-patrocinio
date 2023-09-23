/**************************************************************************
 * In this Card component: We're using react-beautiful-dnd's Draggable    *
 * component to make the card draggable. We are also passing              *
 * the properties "draggableId " and "index" to a "Draggable".            *
 **************************************************************************/
import React from 'react';
import {useState} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ConsutationDisplay from '../components/ConsutationDisplay.jsx'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


/**
 * Consultancy Card Component
 *
 * This component represents a custom card that can be dragged and displayed in a draggable list.
 * It displays information from the provided 'card' object, including a tag. It also supports opening
 * a consultation dialog on double click.
 *
 * @param {Object} card - The card object containing information to display.
 * @param {number} index - The index of the card in the list.
 * @returns {JSX.Element} - The JSX element representing the custom card.
 */
const ConsultationTicket = ({card,index}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tag, setTag] = useState(card.tag);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMenu,setShowMenu] = useState(false)

  if (card == null || card.length === 0) {
    return <div>No cards.</div>;
  }

  const showConsultationHandler = () => {
    setOpenDialog(true)
  }

  const closeConsultationHandler = () => {
    setOpenDialog(false)
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteClick = () => {
    //TODO: Llama a la función deleteConsultation aquí
    console.log('Deleting');
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Draggable draggableId={String(card.consultation)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card style={{width: '15vw', margin: '0 auto' , position: 'relative'}} onDoubleClick={showConsultationHandler}>
            <CardContent
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  visibility: showMenu ? 'visible' : 'hidden',
                }}
              >
                <IconButton aria-label="menu-ticket" onClick={handleMenuClick}>
                  <MoreHorizIcon/>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleDeleteClick}>Delete Consultation</MenuItem>
                </Menu>
              </div>
              <Typography
                color="textSecondary"
                gutterBottom
              >
                {tag}
              </Typography>
            </CardContent>
          </Card>
          <ConsutationDisplay consultation={card} open={openDialog} onClose={closeConsultationHandler} updateViewTag={setTag}/>
        </div>
      )}
    </Draggable>
  );
};

export default ConsultationTicket;
