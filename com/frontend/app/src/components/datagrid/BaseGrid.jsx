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
import { formatDateToString } from '../../utils/tools';
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
 * @returns {JSX.Element} FullCrudGrid component.
 */
export default function BaseGrid({initialRows, columns, emptyRecord, onUpdateRow, onDeleteRow, onCreateRow}) {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [alertMessage, setAlertMessage] = React.useState(null);


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
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
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
    };

    const processRowUpdate = async (newRow) => {
        let updatedRow = { ...newRow, isNew: false };

        const editedRow = rows.find((row) => row.id === updatedRow.id);
        const formatDate = formatDateToString(updatedRow['birth_date']);
        updatedRow.birth_date = formatDate;
        if (editedRow.isNew) {
            const data = await onCreateRow(updatedRow);
            updatedRow = data;
        } else {
            await onUpdateRow(updatedRow);
        }
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
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
            onProcessRowUpdateError={handleProcessError}
            slots={{
                toolbar: EditToolbar,
            }}
            slotProps={{
                toolbar: { setRows, setRowModesModel, emptyRecord},
            }}
            />
            <AlertSnackbar onClose={() => setAlertMessage(null)} message={alertMessage} severity={"error"}/>
        </Box>
    );
};
