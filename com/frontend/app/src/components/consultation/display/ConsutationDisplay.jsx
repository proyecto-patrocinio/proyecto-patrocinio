import React from 'react';
import {useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Button, BottomNavigation, BottomNavigationAction} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {getConsultation, updateConsultationField} from '../../../utils/caseTaker.jsx';
import ClientTableRow from './ClientTableRow.jsx';
import EditableFieldRow from '../../EditableFieldRow.jsx';
import EditableChoiceRow from '../../EditableChoiceRow.jsx';
import { formatTimestamp } from '../../../utils/tools.jsx';
import InfoIcon from '@mui/icons-material/Info';
import CommentIcon from '@mui/icons-material/Comment';



/**
 * Functional component for displaying consultation details in a dialog.
 * 
 * @param {Object} consultation - The consultation data to display.
 * @param {boolean} open - Boolean indicating whether the dialog is open.
 * @param {Function} onClose - Function to close the dialog.
 * @param {Function} updateViewTag - Function to update the view tag in CardView.
 * @returns {JSX.Element} - The ConsultationDisplay component JSX.
 */
const ConsutationDisplay = ({consultation, open, onClose, updateViewTag }) => {
    const [consultationData, setConsultation] = useState(consultation)
    const [updateViewCounter, setUpdateViewCounter] = useState(0); // Force update View
    const [windowNumber, setWindowNumber] = useState(0)
    const [isFieldsEditing, setIsFieldsEditing] = useState({
        "description": false,
        "tag": false,
        "opponent": false,
        "progress_state": false,
    });
    const [editedFields, setEditedFields] = useState({
        "description": consultationData.description,
        "tag": consultationData.tag,
        "opponent": consultationData.opponent,
        "progress_state": consultationData.progress_state,
    });
    const [fieldsError, setFieldsError] = useState({
        "description": "",
        tag: "",
        "opponent": "",
        "progress_state": "",
    });

    /**
     * Handles the click event to enable editing of a specific field.
     * @param {string} fieldKey - The key of the field to be edited.
     */
    const handleEditClick = (fieldKey) => {
        isFieldsEditing[fieldKey] = true;
        setIsFieldsEditing(isFieldsEditing);
        fieldsError[fieldKey] = "";
        setFieldsError(fieldsError)
        setUpdateViewCounter(updateViewCounter + 1);
        editedFields[fieldKey] = consultationData[fieldKey]
        setEditedFields(editedFields)
    };

    /**
     * Handles the click event to save changes made to a specific field.
     * @param {string} fieldKey - The key of the field being edited.
     */
    const handleSaveClick = async(fieldKey) => {
        if (editedFields[fieldKey] === ""
        || editedFields[fieldKey] === undefined
        || editedFields[fieldKey] === null
        ) {
            fieldsError[fieldKey] = "This field cannot be empty."
            setFieldsError(fieldsError);
        } else {
            try {
                await updateConsultationField(consultationData.id, fieldKey, editedFields[fieldKey])
                fieldsError[fieldKey] = "";
                setFieldsError(fieldsError);
                setConsultation((prevConsultation) => ({
                    ...prevConsultation,
                    [fieldKey]: editedFields[fieldKey],
                }));
                isFieldsEditing[fieldKey] = false;
                setIsFieldsEditing(isFieldsEditing);
                if (fieldKey === "tag") {
                    updateViewTag(editedFields.tag)
                }
            } catch(e) {
                fieldsError[fieldKey] = "Error updating field. Please try again."
                setFieldsError(fieldsError);
            }
        }
        setUpdateViewCounter(updateViewCounter + 1);
    };

    /**
     * Handles the change event for a field's value.
     * @param {Object} event - The change event object.
     * @param {string} fieldKey - The key of the field being edited.
     */
    const handleOnChange = (event, fieldKey) => {
        const newValue = event.target.value;
        editedFields[fieldKey] = newValue
        setEditedFields(editedFields);
        fieldsError[fieldKey] = "";
        setFieldsError(fieldsError);
        setUpdateViewCounter(updateViewCounter + 1);
    };

    /**
     * Handles the click event to cancel editing of a specific field.
     * @param {string} fieldKey - The key of the field to be canceled.
     */
    const handleOnCancel = (fieldKey) => {
        isFieldsEditing[fieldKey] = false;
        setIsFieldsEditing(isFieldsEditing);
        fieldsError[fieldKey] = "";
        setFieldsError(fieldsError);
        setUpdateViewCounter(updateViewCounter + 1);
    };


    /**
     * Fetch consultation data if client data is not available.
     */
	useEffect(() => {
		const fetchConsultancy = async () => {
            try {
                if (!consultation.client) {
                    const consultationResponse = await getConsultation(consultation.consultation)
                    setConsultation(consultationResponse)
                }
            } catch (error) {
                console.error("Failed to fetch Consultation in Card.");
                console.debug(error);
            }
        };

        fetchConsultancy();

    }, [consultation]);

    /**
     * Close the dialog.
     */
    const handleClose = () => {
        onClose();
    };


    return (
        <Dialog fullWidth={true} maxWidth={'md'} open={open} onClose={handleClose} >
        <DialogTitle variant="h5" sx={{ textAlign: 'center' }}>
            Consultation Details
        </DialogTitle>
        <BottomNavigation
            sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
                padding: '10px',
            }}
            showLabels
            value={windowNumber}
            onChange={(event, newValue) => {
                setWindowNumber(newValue);
            }}
        >
            <BottomNavigationAction label="Info" icon={<InfoIcon />} />
            <BottomNavigationAction label="Comments" icon={<CommentIcon />} />
        </BottomNavigation>


        <DialogContent>
        {(windowNumber===0)&&
        <div elevation={3} style={{ padding: '20px' }}>
        <TableContainer style={{width: '800px'}}>
            <Table>
            <TableBody>
                <EditableFieldRow
                    tittle={"Tag:"}
                    isEditing={isFieldsEditing.tag}
                    value={isFieldsEditing.tag ? editedFields.tag : consultationData.tag }
                    onEdit={handleEditClick}
                    onSave={handleSaveClick}
                    onChange={handleOnChange}
                    onCancel={handleOnCancel}
                    error={fieldsError.tag}
                    fieldKey={"tag"}
                />
                <ClientTableRow clientID={consultationData.client}/>
                <EditableFieldRow
                    tittle={"Opponent:"}
                    isEditing={isFieldsEditing.opponent}
                    value={isFieldsEditing.opponent ? editedFields.opponent : consultationData.opponent}
                    onEdit={handleEditClick}
                    onSave={handleSaveClick}
                    onChange={handleOnChange}
                    onCancel={handleOnCancel}
                    error={fieldsError.opponent}
                    fieldKey={"opponent"}
                />
                <TableRow>
                <TableCell>Availability State:</TableCell>
                <TableCell>{consultationData.availability_state}</TableCell>
                </TableRow>
                <EditableChoiceRow
                    title={"Progress State:"}
                    isEditing={isFieldsEditing.progress_state}
                    value={consultationData.progress_state}
                    onEdit={handleEditClick}
                    onSave={handleSaveClick}
                    onChange={handleOnChange}
                    onCancel={handleOnCancel}
                    error={fieldsError.progress_state}
                    fieldKey={"progress_state"}
                    options={["TODO", "IN_PROGRESS", "DONE", "PAUSED", "BLOCKED"]}
                />
                <EditableFieldRow
                    tittle={"Description:"}
                    isEditing={isFieldsEditing.description}
                    value={isFieldsEditing.description ? editedFields.description : consultationData.description}
                    onEdit={handleEditClick}
                    onSave={handleSaveClick}
                    onChange={handleOnChange}
                    onCancel={handleOnCancel}
                    error={fieldsError.description}
                    fieldKey={"description"}
                />
                <TableRow>
                <TableCell>Creation time stamp:</TableCell>
                <TableCell>{formatTimestamp(consultationData.time_stamp)}</TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </TableContainer>
        </div>
        }
        {(windowNumber===1)&&
        
        "TODO: comments"
        }

        </DialogContent>
        <Button onClick={handleClose} color="primary">
            Close
        </Button>
        </Dialog>
    );
};

export default ConsutationDisplay;
