import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {
  GridRowModes,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { getRandomNumber } from '../../utils/tools';

/**
 * EditToolbar component for an editing toolbar.
 *
 * @param {function} setRows - Function to set the rows.
 * @param {function} setRowModesModel - Function to set the row modes model.
 * @param {object} emptyRecord - Empty record used for creating new rows.
 * @returns {JSX.Element} Edit toolbar component.
 */
export function EditToolbar({setRows, setRowModesModel, emptyRecord}) {

  const handleClick = () => {
    const id = getRandomNumber(Number.MAX_SAFE_INTEGER);
    setRows((oldRows) => [{ id, ...emptyRecord, isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id' },
    }));
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
    </GridToolbarContainer>
  );
};
