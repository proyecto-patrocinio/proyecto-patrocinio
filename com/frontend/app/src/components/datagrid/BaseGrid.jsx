import React from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { EditToolbar } from './EditToolbar';
import AlertSnackbar from '../AlertSnackbar';


/**
 * BaseGrid component for a data grid with CRUD (Create, Read, Update, Delete) operations.
 *
 * @param {Array} initialRows - Initial set of rows for the grid.
 * @param {Array} columns - Column configuration for the grid.
 * @param {object} emptyRecord - Empty record used for creating new rows.
 * @param {function} onUpdateRow - A function to handle row updates when the user interacts with the grid.
 * @param {function} onDeleteRow - A function to handle row deletes when the user interacts with the grid.
 * @param {function} onCreateRow - A function to handle row creates when the user interacts with the grid.
 * @param {function} formatDataRow - A function to format the data row before sending update or create queries to the API.
 * @param {function} isCellEditable - Callback fired when a cell is rendered, returns true if the cell is editable.
 * @param {function} handleCellRendering - Handler to render the data after a row in the table is created or updated
 * @param {function} preprocessEdit - Fuction to processes the data before editing a row.
 * @param {boolean} isMultipleEdition - True if multiple records can be edited at the same time. Otherwise false.
 * @param {function} doubleClickHandler - Handler to double-click the row when the user interacts.
 * @returns {JSX.Element} FullCrudGrid component.
 */
export default function BaseGrid({
    initialRows, columns, emptyRecord, onUpdateRow, onDeleteRow, onCreateRow,
    formatDataRow, isCellEditable=null, handleCellRendering=(data)=>data, preProcessEdit=()=>{},
    isMultipleEdition=true, doubleClickHandler= ()=>{},
}) {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [alertMessage, setAlertMessage] = React.useState(null);
    const [isAnyRowEditing, setIsAnyRowEditing] = React.useState(false);

    React.useEffect(()=>{
        setRows(initialRows)
    }, [initialRows]);

    const handleProcessError = (error) => {
        setAlertMessage(error.message);
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        if ((!isMultipleEdition) && isAnyRowEditing) {
                setAlertMessage("There is already a record in editing.");
                return;
        }
        setIsAnyRowEditing(true);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        const editRow =  rows.find((row) => row.id === id);
        preProcessEdit(editRow);
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
        setIsAnyRowEditing(false);
    };

    const handleDeleteClick = (id) => () => {
        onDeleteRow(id).then(()=> {
            setRows(rows.filter((row) => row.id !== id));
        });
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
        setIsAnyRowEditing(false);
    };

    const processRowUpdate = async (newRow) => {
        let updatedRow = { ...newRow, isNew: false };

        const editedRow = rows.find((row) => row.id === updatedRow.id);
        updatedRow = formatDataRow(updatedRow);
        if (editedRow.isNew) {
            updatedRow = await onCreateRow(updatedRow);
        } else {
            updatedRow = await onUpdateRow(updatedRow);
        }
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        const resultData = handleCellRendering(updatedRow)
        return resultData;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columnsWithActions = [
        ...columns,
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
                return [
                <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    sx={{
                    color: 'primary.main',
                    }}
                    onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                />,
                ];
            }

            return [
                <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
                />,
                <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
                />,
            ];
            },
        },
    ];

    const canCreateRow = (!isMultipleEdition && !isAnyRowEditing) || isMultipleEdition

    return (
        <Box
            sx={{
            '& .actions': {
                color: 'text.secondary',
            },
            '& .textPrimary': {
                color: 'text.primary',
            },
            }}
        >
            <DataGrid
            rows={rows}
            columns={columnsWithActions}
            editMode="none"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onRowDoubleClick={doubleClickHandler}
            onProcessRowUpdateError={handleProcessError}
            isCellEditable={isCellEditable}
            slots={{
                toolbar: EditToolbar,
            }}
            slotProps={{
                toolbar: { setRows, setRowModesModel, emptyRecord, setIsAnyRowEditing, canCreateRow },
            }}
            />
            <AlertSnackbar onClose={() => setAlertMessage(null)} message={alertMessage} severity={"error"}/>
        </Box>
    );
};
