import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import CardTicket from './CardTicket';
import TitlePanel from '../components/TitlePanel';
import BasePanel from '../components/BasePanel';
import TicketMenu from '../components/TicketMenu';
import { MenuItem } from '@mui/material';
import { deletePanel } from '../utils/panel';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';



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
  const [deleteError, setDeleteError] = useState(null);


  useEffect(() => {
  }, [isDeleted]);

    useEffect(() => {
      // Borra el mensaje de error después de 5 segundos
      if (deleteError) {
        const timer = setTimeout(() => {
          setDeleteError(null);
        }, 5000); // 5000 milisegundos = 5 segundos
  
        return () => {
          clearTimeout(timer); // Limpia el temporizador si el componente se desmonta antes
        };
      }
    }, [deleteError]);


  if(isDeleted) {
    return null;
  }

  /**
   * Handles the click event on the delete button.
   * Deletes the panel if it contains no cards.
   */
  const handleDeleteClick = () => {
    if (panel.cards.length === 0){
      deletePanel(panel.id).then((deleted) => {
        if(deleted){
          setIsDeleted(true);
        } else {
          setDeleteError("No se pudo eliminar el panel por algún motivo...");
        }
      }).catch((error) => {
        setDeleteError("No se pudo eliminar el panel debido a un error en la solicitud.");
      });
    } else {
      setDeleteError("No se pudo eliminar el panel por algún motivo...");
    }
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
    <div>
          <Snackbar open={!!deleteError} autoHideDuration={5000} onClose={() => setDeleteError(null)}>


        {/* {deleteError && ( */}
        <Alert severity="error" key={"delete-error"}>
          <AlertTitle>Error</AlertTitle>
          {deleteError}
        </Alert>
      {/* )} */}
          </Snackbar>
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
    </div>
  );
};


export default CardPanel;
