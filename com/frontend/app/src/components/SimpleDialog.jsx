import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

/**
 * SimpleDialog Component
 *
 * This component represents a simple dialog with a title, description, and customizable content.
 *
 * @component SimpleDialog
 * @param {string} title - The title of the dialog.
 * @param {string} description - The description or message displayed in the dialog.
 * @param {boolean} isOpen - A boolean indicating whether the dialog is open or closed.
 * @param {function} onClose - The function to close the dialog.
 * @param {function} onAccept - The function to handle the "Accept" button click.
 * @param {ReactNode} children - Optional content to be rendered inside the dialog (e.g., form inputs).
 */
function SimpleDialog({title, description, isOpen, onClose, onAccept, children}) {
  return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {description}
          </DialogContentText>
          {/* Inputs or Form */}
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" id="button-cancel">
            Cancel
          </Button>
          <Button onClick={onAccept} color="primary" id="button-accept">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default SimpleDialog;
