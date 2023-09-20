import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';

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
