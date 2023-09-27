import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';


/**
 * AlertSnackbar component renders a customized Snackbar with an Alert component.
 *
 * @param {Object} props - The props for the component.
 * @param {function} props.onClose - The function to be called when the Snackbar is closed.
 * @param {string|null} props.message - The message to be displayed in the Snackbar.
 * @param {string|null} props.title - The title of the Alert component.
 * @param {string} [props.severity="success"] - The severity level of the Alert (success, error, warning, info).
 * @returns {JSX.Element} - A React JSX element representing the AlertSnackbar.
 */
function AlertSnackbar({ onClose, message=null, title=null, severity="success"}) {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={5000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity} key="CustomAlert">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertSnackbar;
