import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BaseGrid from './BaseGrid';
import { addPhoneNumer, createClient, deleteClient, deletePhoneNumer, updateClient } from '../../utils/client';
import { findUniqueElementsInA, formatDateToString } from '../../utils/tools';
import { getLocalityByID, getLocalityList, getNationalityList, getProvinceList } from '../../utils/locality';
import PhoneNumbersDialog from '../PhoneNumbersDialog';


/**A React component that displays client data in a table using Material-UI DataGrid.
 * @param {Object[]} data - An array of client data objects to be displayed in the table.
 * @returns {JSX.Element} The ClientDataTable component.
*/
function ClientDataTable({ data }) {
  const [nationalityOptions, setNationalityOptions] = useState(null);
  const [provinceOptions, setProvinceOptions] = useState(null);
  const [localityOptions, setLocalityOptions] = useState(null);
  const [geographyModel, setGeographyModel] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [isPhoneNumbersDialogOpen, setIsPhoneNumbersDialogOpen] = useState(false);


  useEffect( () => {
    const updateGeographic = async () => {
      const nationalityList = await getNationalityList();
      const provinceList = geographyModel?.nationality?.id ? await getProvinceList(geographyModel.nationality.id) : null;
      const localityList = geographyModel?.province?.id ? await getLocalityList(geographyModel.province.id) : null;
      setNationalityOptions(nationalityList);
      setProvinceOptions(provinceList);
      setLocalityOptions(localityList);
    };
    updateGeographic();
  },[geographyModel]);

  /**
   * Update Row Handler. Updates a client's information when save changes editions.
   * @param {Object} client - The client to be updated.
   * @returns {Promise<Object>} The updated client data.
   */
  const updateRowHandler = async (client) => {
    const updatedClient = await updateClient(client);
    const originalTels = client.tels;
    let updatedPhoneNumbers = originalTels;
    const deletedPhoneNumbers = findUniqueElementsInA(originalTels, phoneNumbers);
    const addPhoneNumbers = findUniqueElementsInA(phoneNumbers, originalTels);
    for (let index = 0; index < addPhoneNumbers.length; index++) {
      let phone = addPhoneNumbers[index];
      phone.client = client.id;
      phone = await addPhoneNumer(phone);
      updatedPhoneNumbers.push(phone);
    }
    for (let index = 0; index < deletedPhoneNumbers.length; index++) {
      let phone = deletedPhoneNumbers[index];
      phone.client = client.id;
      await deletePhoneNumer(phone);
      updatedPhoneNumbers = updatedPhoneNumbers.filter(item => item.id !== phone.id);
    }
    updatedClient.tels = updatedPhoneNumbers;
    setPhoneNumbers(updatedPhoneNumbers);
    return updatedClient;
  };

  /**Handler to format the data row before sending update or create queries to the API.*/
  const formatClientData = (clientData) => {
    let clientDataFormatted = clientData
    const formatDate = formatDateToString(clientData['birth_date']);
    clientDataFormatted.birth_date = formatDate;
    clientDataFormatted.locality = geographyModel?.locality?.id;
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
    clientRendered.tels = phoneNumbers;
    return clientRendered;
  };

  /**Investigates whether a cell is editable or not based on the custom rules established
   * only one row is editable at a time.
   * And the document fields only can be writable when the client is new.
  */
  const isCellEditable = (params) => {

    if((params.row.isNew !== true) && (
      params.field === "id_type" ||
      params.field === "id_value"
      )){
      return false;
    };
    return params.colDef.editable;
  };

  /**
   * A cell component for the Material-UI (MUI) DataGrid table used in renderEditCell.
   * This component is designed to work with fields related to locality, province, and nation.
   *
   * @param {Object} props - The component's properties.
   * @param {Array} props.optionsNameID - The list of options with objects containing 'name' and 'id' properties.
   * @param {Object} props.model - The data model for the cell.
   * @param {function} props.handleChange - The function called when the selected value in the Autocomplete changes.
   *
   * @returns {JSX.Element} - The rendered AutocompleteCell component.
   */
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

  /**
   * On click edit cell handler. Preprocesses the data before editing a row.
   * @param {object} row - The row data.
   */
    const preProcessEdit = (row) => {
      // Init State of Geography
      const locality = row?.locality;
      const province = row?.province;
      const nationality = row?.nationality;
      setGeographyModel({locality: locality, province: province, nationality: nationality, rowID: row?.id});
      // Init States of Phone Number
      setPhoneNumbers(row.tels);
    };

  const columns = [
    { field: 'id', 'type': 'number', headerName: 'ID', width: 70, editable: false},
    { field: 'postal', 'type': 'number', headerName: 'Postal', width: 80, editable: true },
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
    { field: 'id_value', headerName: 'ID Value', width: 120, editable: true },
    { field: 'first_name', headerName: 'First Name', width: 150, editable: true },
    { field: 'last_name', headerName: 'Last Name', width: 150, editable: true },
    {
      field: 'birth_date',  headerName: 'Birth Date', width: 100,
      editable: true, type: 'date',
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: 'sex', headerName: 'Sex', width: 110, editable: true,
      type: 'singleSelect',
      valueOptions: [
        {value: 'MALE', label: 'Male'},
        {value: 'FEMALE', label: 'Female'},
      ]
    },
    { field: 'nationality', headerName: 'Nationality',
      width: 150, editable: true,
      renderEditCell: (params) => (
        <AutocompleteCell {...params} optionsNameID={nationalityOptions} model={geographyModel?.nationality}
          handleChange={
            (id, name) => {
              const newModel = {};
              newModel['nationality'] = {id: id, name: name};
              newModel['locality'] = null;
              newModel['province'] = null;
              setGeographyModel(newModel);
          }}
        />
      ),
      valueFormatter: (value) => value.value?.name,
    },
    { field: 'province', headerName: 'Province', editable: true,  width: 200,
      valueFormatter: (value) => value.value?.name,
      renderEditCell: (params) => (
        <AutocompleteCell {...params} optionsNameID={provinceOptions} model={geographyModel?.province}
          handleChange={(id, name) => {
            const newModel = {};
            newModel['nationality'] = geographyModel?.nationality;
            newModel['province'] = {id: id, name: name};
            newModel['locality'] = null;
            setGeographyModel(newModel);
          }}
        />
      )
    },
    { field: 'locality', headerName: 'Locality',
      width: 200, editable: true,
      renderEditCell: (params) => (
        <AutocompleteCell {...params} optionsNameID={localityOptions}  model={geographyModel?.locality}
          handleChange={(id, name) =>{
            const newModel = {}
            newModel['nationality'] = geographyModel?.nationality;
            newModel['province'] = geographyModel?.province;
            newModel['locality'] = {id: id, name: name};
            setGeographyModel(newModel);
          }}
        />
      ),
      valueFormatter: (value) => value?.value?.name,
    },
    {
      field: 'tels',
      headerName: 'Phone Numbers',
      valueFormatter: (value) => value?.value?.map((tel)=> tel?.phone_number),
      width: 180, editable: true,
      renderEditCell: (params) => {
        return(
          <div>
          <Button
            variant="text"
            color="primary"
            startIcon={<LocalPhoneIcon />}
            onClick={() => setIsPhoneNumbersDialogOpen(true)}
            disabled={params?.row?.isNew}
          >
          Manage Tels
          </Button>
          <PhoneNumbersDialog
            open={isPhoneNumbersDialogOpen}
            onClose={() => setIsPhoneNumbersDialogOpen(false)}
            phoneNumbers={phoneNumbers}
            onUpdatePhoneNumbers={setPhoneNumbers}
          />
        </div>
      )},
    },
];

  return (
    <div>
      <BaseGrid
        initialRows={data}
        columns={columns}
        emptyRecord={[]}
        onUpdateRow={updateRowHandler}
        onDeleteRow={deleteClient}
        onCreateRow={createClient}
        formatDataRow={formatClientData}
        isCellEditable={isCellEditable}
        handleCellRendering={handleCellRendering}
        preProcessEdit={preProcessEdit}
        isMultipleEdition={false}
      />
    </div>
  );
};

export default ClientDataTable;
