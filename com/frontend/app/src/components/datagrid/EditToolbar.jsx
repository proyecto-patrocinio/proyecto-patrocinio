import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {
  GridRowModes,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { getRandomNumber } from '../../utils/tools';
import AlertSnackbar from '../AlertSnackbar';

/**
 * EditToolbar component for an editing toolbar.
 *
 * @param {function} setRows - Function to set the rows.
 * @param {function} setRowModesModel - Function to set the row modes model.
 * @param {object} emptyRecord - Empty record used for creating new rows.
 * @param {function} setIsAnyRowEditing - Function to set the is any row editing.
 * @param {boolean} canCreateRow - True if can create any row.
 * @param {fuction} preProcessEdit - Function to prepare, clear, set, reset the states to use.
 * @returns {JSX.Element} Edit toolbar component.
 */
export function EditToolbar({setRows, setRowModesModel, emptyRecord, setIsAnyRowEditing, canCreateRow, preProcessEdit=()=>{}}) {
  const [alertMessage, setAlertMessage] = React.useState(null);

  const handleClick = () => {
    if(canCreateRow){
      preProcessEdit();
      const id = "NEW" + getRandomNumber(Number.MAX_SAFE_INTEGER);
      setRows((oldRows) => [{ id, ...emptyRecord, isNew: true }, ...oldRows]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id' },
      }));
      setIsAnyRowEditing(true);
    } else {
      setAlertMessage("There is already a record in editing.");
    }
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
      <GridToolbarExport
      csvOptions={{
        fileName: 'clientsDataBase',
        delimiter: ';',
        utf8WithBom: true,
      }} />
    <AlertSnackbar onClose={() => setAlertMessage(null)} message={alertMessage} severity={"error"}/>
    </GridToolbarContainer>
  );
};
