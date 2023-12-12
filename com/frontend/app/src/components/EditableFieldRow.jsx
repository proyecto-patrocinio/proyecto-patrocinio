import React from 'react';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { TextareaAutosize } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


/**
 * A component for displaying an editable field in a table row.
 * @param {string} tittle - The title of the field.
 * @param {boolean} isEditing - Indicates if the field is in edit mode.
 * @param {any} value - The value of the field.
 * @param {function} onEdit - The function to handle the edit action.
 * @param {function} onSave - The function to handle the save action.
 * @param {function} onChange - The function to handle changes in the field value.
 * @param {function} onCancel - The function to handle the cancel action.
 * @param {string} error - The error message.
 * @param {string} FieldKey - The key of the field to be changed.
 * @returns {JSX.Element} - The rendered component.
 * @example
 * <EditableFieldRow
 *   tittle={"My Field Title"}
 *   isEditing={isEditState}
 *   value={isEditState ? editedValueState : TrueDataValue}
 *   onEdit={handleEditClick}
 *   onSave={handleSaveClick}
 *   onChange={handleOnChange}
 *   onCancel={handleCancelClick}
 *   error={iserror ? "ERROR MESSAGE": ""}
 *   FieldKey="name field key"
 * />
 */
const EditableFieldRow = ({ tittle, isEditing, value, onEdit, onSave, onChange, onCancel, error, fieldKey}) => {
    return (
        <TableRow>
        <TableCell>{tittle}</TableCell>
        <TableCell>
            {isEditing ? (
            <TextareaAutosize
                id="edit-field-textarea"
                value={value}
                onChange={(event) => onChange(event, fieldKey)}
                error={!!error}
                helperText={error}
                style={{ width: '100%' }}
            />
            ) : (
            <span style={{ whiteSpace: 'pre-line' }}>
                {value}
            </span>
            )}
        </TableCell>
        <TableCell>
            {isEditing ? (
            <div>
                <IconButton id="field-save-button" onClick={() => onSave(fieldKey)} size="small" color="primary">
                    <SaveIcon />
                </IconButton>
                <IconButton id="field-cancel-button" onClick={() => onCancel(fieldKey)} size="small" color="primary">
                    <CloseIcon />
                </IconButton>
            </div>
            ) : (
                <IconButton id="field-edit-button" onClick={() => onEdit(fieldKey)} size="small" color="primary">
                <EditIcon />
                </IconButton>
            )}
        </TableCell>
        </TableRow>
    );
};

export default EditableFieldRow;
