import React from 'react';
import { Snackbar, Alert } from '@material-ui/core';

/**
 * SuccessSnackbar Component
 *
 * This component represents a Snackbar notification for displaying a success message.
 *
 * @component SuccessSnackbar
 * @param {boolean} isSuccess - A boolean indicating whether the success Snackbar is open or closed.
 * @param {function} onClose - The function to close the success Snackbar.
 * @param {string} message - (Optional) The success message to be displayed in the Snackbar.
 */
function SuccessSnackbar({ isSuccess, onClose, message }) {
  return (
    <Snackbar
      open={isSuccess}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity="success">
        {message} ? {message} : Operation completed successfully!!
      </Alert>
    </Snackbar>
  );
}

export default SuccessSnackbar;
