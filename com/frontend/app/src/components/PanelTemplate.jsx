/**
 * PanelTemplate Component
 *
 * This component provides a user interface for creating a panel by entering a title.
 * It includes an IconButton that opens a dialog when clicked, allowing the user
 * to input a title and create a panel.
 *
 * @component PanelTemplate
 */
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@mui/material';
import createPanel from './utils/panel';
import { Snackbar, Alert } from '@mui/material';


function PanelTemplate({boardID, addPanel}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);


  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  // Function to handle the 'Accept' button click
  const handleAccept = async () => {
    if (title.trim() === '') {
      setError('The title cannot be empty.');
    } else {
      setOpen(false);
      setError('');
      const response = await createPanel(title, boardID);
      if (response.state === true) {
        const panel = response.data
        addPanel(panel.id, panel.title);
        // Show a success notification
        setSuccess(true);
      } else {
        // Show an error notification
        setError('Failed to create panel. Please try again later.');
      }
    }
  };

  // Function to handle title input change
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  // Function to close the success Snackbar
  const handleCloseSuccessSnackbar = () => {
    setSuccess(false);
  };

  return (
    <div>
      {/* Tooltip to provide a hint for the IconButton */}
      <Tooltip title="Create Panel">
        <IconButton aria-label="delete" color='primary' onClick={handleClickOpen}>
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Panel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a title and click 'Accept' to create a panel.
          </DialogContentText>
          {/* Input field for entering the title */}
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={handleChangeTitle}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        {/* Actions in the dialog */}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAccept} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for success notification */}
      <Snackbar
        open={success}
        autoHideDuration={3000} // Auto-closes in 3 seconds
        onClose={handleCloseSuccessSnackbar}
      >
        <Alert onClose={handleCloseSuccessSnackbar} severity="success">
          Panel created successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PanelTemplate;
