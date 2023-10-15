import React, { useEffect, useState } from 'react';
import BaseGrid from './BaseGrid';
import { createClient, deleteClient, updateClient } from '../../utils/client';
import { formatDateToString } from '../../utils/tools';
import { getLocalityByID, getLocalityList, getNationalityList, getProvinceList } from '../../utils/locality';
import { Autocomplete, TextField } from '@mui/material';


/**A React component that displays client data in a table using Material-UI DataGrid.
 * @param {Object[]} data - An array of client data objects to be displayed in the table.
 * @returns {JSX.Element} The ClientDataTable component.
*/
function ClientDataTable({ data }) {
  const [nationalityOptions, setNationalityOptions] = useState(null)
  const [provinceOptions, setProvinceOptions] = useState(null)
  const [localityOptions, setLocalityOptions] = useState(null)
  const [nationalitySelectID, setnationalitySelectID] = useState(null)
  const [provinceSelectID, setprovinceSelectID] = useState(null)
  const [geographyModel, setGeographyModel] = useState({})

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

  /**Handle changes in cell values for the DataGrid.
   * @param {Object} params - The parameters object containing information about the edited cell.
   */
  const handleCellValueChange = (params) => {
    console.log("handlecellvaluechange: ",params.tabIndex.cell?.field)
    // const field = params.tabIndex.cell?.field;
    // const idField = params.tabIndex.cell?.id;
    // if (params.editRows[idField] !== undefined){
    //   const value = params.editRows[idField][field]?.value;
    //   if (field === 'nationality') {
    //     setnationalitySelectID(value);
    //     setprovinceSelectID(null);
    //   } else if (field === 'province') {
    //     setprovinceSelectID(value);
    //   };
    // };
  };//TODO: borrar

  /**Handler to format the data row before sending update or create queries to the API.*/
  const formatClientData = (clientData) => {
    let clientDataFormatted = clientData
    const formatDate = formatDateToString(clientData['birth_date']);
    clientDataFormatted.birth_date = formatDate;
    return clientDataFormatted;
  };

  /**Handler to render the data after a row in the table is created or updated
   * @param {*} clientData
   * @returns rendered data
   */
  const handleCellRendering = async (clientData) => {
    const localityData = await getLocalityByID(clientData.locality);
    const clientRendered = clientData;
    clientRendered.locality = {'id': localityData.id, 'name': localityData.name};
    clientRendered.province = {'id': localityData.province.id, 'name': localityData.province.name};
    clientRendered.nationality = {
      'id': localityData.province.nationality.id, 'name': localityData.province.nationality.name
    };
    return clientRendered;
  };

  /**Investigates whether a cell is editable or not based on the custom rules established*/
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

    function AutocompleteCell(props) {
      const nameToIdMap = {};
      props.optionsNameID?.forEach((item) => {
        nameToIdMap[item.name] = item.id;
      });
      return (
          <Autocomplete
            fullWidth
            options={Object.keys(nameToIdMap) || []}
            value={props.model?.name}
            onChange={(event, newValue) => {
              const newID =  nameToIdMap[newValue];
              const newName = newValue;
              props.handleChange(newID, newName);
            }}
            renderInput={(params) => (
              <TextField {...params}/>
            )}
          />
      )
    }

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
      width: 150, editable: true,
      renderEditCell: (params) => (
        <AutocompleteCell {...params} optionsNameID={nationalityOptions} model={geographyModel.nationality}
          handleChange={
            (id, name) => {
              setnationalitySelectID(id);
              geographyModel.nationality.id = id;
              geographyModel.nationality.name = name;
              geographyModel.locality = null;
              geographyModel.province = null;
              setGeographyModel(geographyModel);
              setprovinceSelectID(null);
          }}
        />
      ),
      valueFormatter: (value) => value.value.name,
    },
    { field: 'province', headerName: 'Province', editable: true,  width: 200,
      valueFormatter: (value) => value.value.name,
      renderEditCell: (params) => (
        <AutocompleteCell {...params} optionsNameID={provinceOptions}
          handleChange={(id, name) => {
            setprovinceSelectID(id);
            geographyModel.province.id = id;
            geographyModel.province.name = name;
            geographyModel.locality = null;
            setGeographyModel(geographyModel);
          }}
        />
      )
    },
    { field: 'locality', headerName: 'Locality',
      width: 200, editable: true, onsubmit: ()=>{console.log("SUMBIT")}, 
      renderEditCell: (params) => (
        <AutocompleteCell {...params} optionsNameID={localityOptions}  model={geographyModel.province}
          handleChange={(id, name) =>{
            geographyModel.locality.id = id;
            geographyModel.locality.name = name;
            setGeographyModel(geographyModel);
          }}
        />
      ),
      valueFormatter: (value) => value.value.name,
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
        handleCellRendering={handleCellRendering}
      />
    </div>
  );
};

export default ClientDataTable;
