/**************************************************************************
 * In this Card component: We're using react-beautiful-dnd's Draggable    *
 * component to make the card draggable. We are also passing              *
 * the properties "draggableId " and "index" to a "Draggable".            *
 **************************************************************************/
import React, { useEffect } from 'react';
import {useState} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ConsutationDisplay from '../components/ConsutationDisplay.jsx'
import TicketMenu from '../components/TicketMenu.jsx';
import { MenuItem } from '@mui/material';
import { rejectRequestConsult } from '../utils/board.jsx';


/**
 * InputRequestTicket is a component that represents a ticket with input request in Input Request Panel.
 *
 * @param {Object} card - The object containing information about the request consultation, including its tag and consultation details.
 * @param {number} index - The index of the card in the list of request consultation.
 * @returns {JSX.Element|null} - A JSX element representing the ticket card or null if the request is rejected.
 */
const InputRequestTicket = ({card,index}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tag, setTag] = useState(card.tag);
  const [showMenu, setShowMenu] = useState(false)
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
  }, [isRejected]);

  if (card == null || card.length === 0) {
    return <div>No cards.</div>;
  }

  if(isRejected) {
    return null;
  }

  const showConsultationHandler = () => {
    setOpenDialog(true)
  }

  const closeConsultationHandler = () => {
    setOpenDialog(false)
  }


  const handleRejectedClick = async() => {
    rejectRequestConsult(card.consultation).then((rejected) => {
      if (rejected) {
        setIsRejected(true);
      }
    })
  };


  return (
    <Draggable draggableId={String(card.consultation)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card style={{width: '15vw', margin: '0 auto', position: 'relative'}} onDoubleClick={showConsultationHandler}>
            <CardContent
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <TicketMenu showMenu={showMenu}>
                <MenuItem onClick={handleRejectedClick}>Rejected</MenuItem>
              </TicketMenu>
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

export default InputRequestTicket;
