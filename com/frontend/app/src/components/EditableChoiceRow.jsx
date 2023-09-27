import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


/**
 * EditableChoiceRow component allows the user to edit (or choose) a value from a list of options.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.title - The title displayed in the row.
 * @param {boolean} props.isEditing - Indicates whether the row is in editing mode.
 * @param {string} props.value - The current value to display or edit.
 * @param {function} props.onEdit - The function to be called when the user initiates editing.
 * @param {function} props.onSave - The function to be called when the user saves the edited value.
 * @param {function} props.onChange - The function to handle changes to the edited value.
 * @param {function} props.onCancel - The function to be called when the user cancels editing.
 * @param {string} props.error - An error message to display if there is an error with the edited value.
 * @param {string} props.fieldKey - A key identifier for the field being edited.
 * @param {string[]} props.options - An array of available options to choose from.
 * @returns {JSX.Element} - A React JSX element representing the EditableChoiceRow.
 */
const EditableChoiceRow = ({ title, isEditing, value, onEdit, onSave, onChange, onCancel, error, fieldKey, options }) => {
  return (
    <TableRow>
      <TableCell>{title}</TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={value}
            onChange={(event) => onChange(event, fieldKey)}
            error={!!error}
            style={{ width: '100%' }}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <span>{value}</span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div>
            <IconButton onClick={() => onSave(fieldKey)} size="small" color="primary">
              <SaveIcon />
            </IconButton>
            <IconButton onClick={() => onCancel(fieldKey)} size="small" color="primary">
              <CloseIcon />
            </IconButton>
          </div>
        ) : (
          <IconButton onClick={() => onEdit(fieldKey)} size="small" color="primary">
            <EditIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default EditableChoiceRow;
