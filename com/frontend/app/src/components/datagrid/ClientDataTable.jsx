import React, { useEffect, useState } from 'react';
import BaseGrid from './BaseGrid';
import { createClient, deleteClient, updateClient } from '../../utils/client';
import { formatDateToString } from '../../utils/tools';
import { getLocalityByID, getLocalityList, getNationalityList, getProvinceList } from '../../utils/locality';


/**
 * A React component that displays client data in a table using Material-UI DataGrid.
 *
 * @param {Object[]} data - An array of client data objects to be displayed in the table.
 * @returns {JSX.Element} The ClientDataTable component.
*/
function ClientDataTable({ data }) {
  const [nationalityOptions, setNationalityOptions] = useState(null)
  const [provinceOptions, setProvinceOptions] = useState(null)
  const [localityOptions, setLocalityOptions] = useState(null)
  const [nationalitySelectID, setnationalitySelectID] = useState(null)
  const [provinceSelectID, setprovinceSelectID] = useState(null)


  useEffect( () => {
    const updateGeographic = async () => {
      const nationalityList = await getNationalityList();
      const provinceList = nationalitySelectID ? await getProvinceList(nationalitySelectID) : null;
      const localityList = provinceSelectID ? await getLocalityList(provinceSelectID) : null;
      setNationalityOptions(nationalityList);
      setProvinceOptions(provinceList);
      setLocalityOptions(localityList);
    };
    updateGeographic();
  },[nationalitySelectID, provinceSelectID])

/**
 * Handle changes in cell values for the DataGrid.
 *
 * @param {Object} params - The parameters object containing information about the edited cell.
 */
  const handleCellValueChange = (params) => {
    const field = params.tabIndex.cell?.field;
    const idField = params.tabIndex.cell?.id;
    if (params.editRows[idField] !== undefined){
      const value = params.editRows[idField][field]?.value;
      if (field === 'nationality') {
        setnationalitySelectID(value);
        setprovinceSelectID(null);
      } else if (field === 'province') {
        setprovinceSelectID(value);
      };
    };
  };

  /**
   * Handler to format the data row before sending update or create queries to the API.
   */
  const formatClientData = (clientData) => {
    let clientDataFormatted = clientData
    const formatDate = formatDateToString(clientData['birth_date']);
    clientDataFormatted.birth_date = formatDate;
    return clientDataFormatted;
  };

  /**
   * Investigates whether a cell is editable or not based on the custom rules established
   */
  const isCellEditable = (params) => {
    if((params.row.isNew !== true) && (
      params.field === "id_type" ||
      params.field === "id_number"
      )){
      // The document fields only can be writable when the client is new.
      return false;
    };
    return params.colDef.editable;
  };

  const columns = [
    { field: 'id', 'type': 'number', headerName: 'ID', width: 70, editable: false},
    { field: 'postal', 'type': 'number', headerName: 'Postal', width: 70, editable: true },
    { field: 'address', headerName: 'Address', width: 150, editable: true },
    {
      field: 'marital_status', headerName: 'Marital Status', width: 120, editable: true,
      type: 'singleSelect',
      valueOptions: [
        {value: 'SINGLE', label: 'Single'},
        {value: 'MARRIED', label: 'Married'},
        {value: 'DIVORCED', label: 'Divorced'},
        {value: 'WIDOWER', label: 'Widower'},
      ]
    },
    {
      field: 'housing_type', headerName: 'Housing Type', width: 200, editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: 'HOUSE', label: 'House' },
        { value: 'DEPARTMENT', label: 'Department' },
        { value: 'TRAILER', label: 'Trailer' },
        { value: 'STREET_SITUATION', label: 'Street Situation' },
      ]
    },
    {
      field: 'studies', headerName: 'Education Level', width: 180, editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: 'INCOMPLETE_PRIMARY', label: 'Incomplete Primary' },
        { value: 'COMPLETE_PRIMARY', label: 'Complete Primary' },
        { value: 'INCOMPLETE_SECONDARY', label: 'Incomplete Secondary' },
        { value: 'COMPLETE_SECONDARY', label: 'Complete Secondary' },
        { value: 'INCOMPLETE_TERTIARY', label: 'Incomplete Tertiary' },
        { value: 'COMPLETE_TERTIARY', label: 'Complete Tertiary' },
        { value: 'INCOMPLETE_UNIVERSITY', label: 'Incomplete University' },
        { value: 'COMPLETE_UNIVERSITY', label: 'Complete University' }
      ]
    },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    {
      field: 'id_type', headerName: 'ID Type', width: 100, editable: true,
      type: 'singleSelect',
      valueOptions: [
        {value: 'DOCUMENT', label: 'Document'},
        {value: 'PASSPORT', label: 'Passport'},
      ]
    },
    { field: 'id_number', 'type': 'number', headerName: 'ID Number', width: 110, editable: true },
    { field: 'first_name', headerName: 'First Name', width: 150, editable: true },
    { field: 'last_name', headerName: 'Last Name', width: 150, editable: true },
    {
      field: 'birth_date',  headerName: 'Birth Date', width: 100,
      editable: true, type: 'date',
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: 'sex', headerName: 'Sex', width: 100, editable: true,
      type: 'singleSelect',
      valueOptions: [
        {value: 'MALE', label: 'Male'},
        {value: 'FEMALE', label: 'Female'},
      ]
    },
    { field: 'nationality', headerName: 'Nationality',
      type: 'singleSelect',  width: 150, editable: true,
      getOptionValue: (value) => value.id,
      getOptionLabel: (value) => value.name,
      valueOptions: nationalityOptions,
      valueFormatter: (value) => value.value.name,
    },
    { field: 'province', headerName: 'Province',
      type: 'singleSelect', width: 180, editable: true,
      getOptionValue: (value) => value.id,
      getOptionLabel: (value) => value.name,
      valueOptions: (params) =>{
        return params.row.nationality===nationalitySelectID? provinceOptions : undefined
      },
      valueFormatter: (value) => value.value.name || value.value,
    },
    { field: 'locality', headerName: 'Locality',
      type: 'singleSelect', width: 180, editable: true,
      getOptionValue: (value) => value.id,
      getOptionLabel: (value) => value.name,
      valueOptions: (params) =>{
        return params.row.province===provinceSelectID? localityOptions : undefined
      },
      valueFormatter: (value) => value.value.name || value.value,
    },
];

  return (
    <div>
      <BaseGrid
        initialRows={data}
        columns={columns}
        emptyRecord={[]}
        onUpdateRow={updateClient}
        onDeleteRow={deleteClient}
        onCreateRow={createClient}
        formatDataRow={formatClientData}
        isCellEditable={isCellEditable}
        handleStateChange={handleCellValueChange}

      />
    </div>
  );
};

export default ClientDataTable;
