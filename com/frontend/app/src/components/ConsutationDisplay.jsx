import React from 'react';
import {useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Button} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {formatTimestamp} from '../utils/format.jsx';
import {getConsultation, updateConsultationField} from '../utils/caseTaker.jsx';
import ClientTable from './ClientTable.jsx';
import EditableFieldRow from './EditableFieldRow.jsx';


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
    const [isFieldsEditing, setIsFieldsEditing] = useState({
        "description": false,
        "tag": false,
        "opponent": false,
    });
    const [editedFields, setEditedFields] = useState({
        "description": consultationData.description,
        "tag": consultationData.tag,
        "opponent": consultationData.opponent,
    });
    const [fieldsError, setFieldsError] = useState({
        "description": "",
        tag: "",
        "opponent": "",
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
        let returnValue = ""
        if (editedFields[fieldKey] === ""
        || editedFields[fieldKey] === undefined
        || editedFields[fieldKey] === null
        ) {
            fieldsError[fieldKey] = "This field cannot be empty."
            setFieldsError(fieldsError);
        } else {
            returnValue = await updateConsultationField(consultationData.id, fieldKey, editedFields[fieldKey])
            
            if (returnValue !== editedFields[fieldKey]) {
                fieldsError[fieldKey] = "Error updating field. Please try again."
                setFieldsError(fieldsError);
            } else {
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
        <Dialog open={open} onClose={handleClose} >
        <DialogTitle variant="h5">Consultation Details</DialogTitle>
        <DialogContent>



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
                <ClientTable clientID={consultationData.client}/>
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
                <TableCell>State:</TableCell>
                <TableCell>{consultationData.state}</TableCell>
                </TableRow>
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


        </DialogContent>
        <Button onClick={handleClose} color="primary">
            Close
        </Button>
        </Dialog>
    );
};

export default ConsutationDisplay;
