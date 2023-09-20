import React from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

/**
 * AddButton Component
 *
 * This component represents an add button with an icon and a title displayed in a tooltip.
 *
 * @component AddButton
 * @param {function} onClick - The function to be executed when the button is clicked.
 * @param {string} title - The title displayed in the tooltip when hovering over the button.
 */
function AddButton({ onClick, title }) {
  return (
    <Tooltip title={title}>
      <IconButton aria-label="create" color="primary" onClick={onClick}>
        <AddCircleIcon />
      </IconButton>
    </Tooltip>
  );
}

export default AddButton;
