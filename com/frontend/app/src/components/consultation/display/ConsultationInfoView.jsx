import React from 'react';
import {useEffect, useState} from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {getConsultation, updateConsultationField} from '../../../utils/caseTaker.jsx';
import ClientTableRow from './ClientTableRow.jsx';
import EditableFieldRow from '../../EditableFieldRow.jsx';
import EditableChoiceRow from '../../EditableChoiceRow.jsx';
import {formatTimestamp} from '../../../utils/tools.jsx';


/**
 * Component for displaying consultation information.
 * @param {Object} consultation - Consultation data to display.
 * @param {function} updateViewTag - (Optional) Function to update the tag of Consultation.
 */
const ConsutationInfoView = ({consultation, updateViewTag=()=>{} }) => {
    const [consultationData, setConsultation] = useState(consultation)
    const [updateViewCounter, setUpdateViewCounter] = useState(0); // Force update View
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



    return (
        <div elevation={3} style={{ padding: '20px' }}>
        <TableContainer style={{width: '800px'}}>
            <Table>
            <TableBody>
                <EditableFieldRow
                    id={"edit-tag"}
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
                    id={"edit-opponent"}
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
                    id={"edit-progress-state"}
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
                    id={"edit-description"}
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
                <TableCell>Creation time stamp (UTC):</TableCell>
                <TableCell>{formatTimestamp(consultationData.time_stamp)}</TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </TableContainer>
        </div>
    );
};

export default ConsutationInfoView;
