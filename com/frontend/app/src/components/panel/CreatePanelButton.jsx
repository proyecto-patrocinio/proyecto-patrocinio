/**
 * CreatePanelButton Component
 *
 * This component provides a user interface for creating a panel by entering a title.
 * It includes an IconButton that opens a dialog when clicked, allowing the user
 * to input a title and create a panel.
 *
 * @component CreatePanelButton
 */
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import createPanel from '../utils/panel';
import AddButton from "./AddButton";
import SimpleDialog from "./SimpleDialog";
import AlertSnackbar from "./AlertSnackbar";


function CreatePanelButton({boardID, addPanel}) {
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
      if (response.status === true) {
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
      <AddButton title={"Create CardPanel"} onClick={handleClickOpen}/>
      <SimpleDialog
          title={"Create CardPanel"}
          description={"Please enter a title and click 'Accept' to create a panel."}
          isOpen={open}
          onAccept={handleAccept}
          onClose={handleClose}
      >
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
      </SimpleDialog>
      <AlertSnackbar
          message={success ? "Panel created successfully!" : null}
          onClose={handleCloseSuccessSnackbar}
      />
    </div>
  );
}

export default CreatePanelButton;
