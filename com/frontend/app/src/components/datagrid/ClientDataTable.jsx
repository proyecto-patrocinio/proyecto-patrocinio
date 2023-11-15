import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BaseGrid from './BaseGrid';
import { addChild, addPatrimony, addPhoneNumer, createClient, createFamily, deleteChild, deleteClient, deletePhoneNumer, getPatrymony, updateClient, updateFamily, updatePatrimony } from '../../utils/client';
import { findUniqueElementsInA, formatDateToString } from '../../utils/tools';
import { getLocalityByID, getLocalityList, getNationalityList, getProvinceList } from '../../utils/locality';
import PhoneNumbersDialog from '../PhoneNumbersDialog';
import { AutocompleteCell } from '../AutocompleteCell';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ChildrenDialog from '../ChildrenDialog';


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
  const [isFamilyDialogOpen, setIsFamilyDialogOpen] = useState(false);
  const [children, setChildren] = useState([]);


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
   * Processes a family, updating or creating it along with its children.
   *
   * @param {Object} family - The family data to be processed.
   * @returns {Promise<Object>} - A promise that resolves to the processed family data.
   */
  const processFamily = async (family) => {
    const FamilyIsNew = family.id.toString().includes('NEW');
    if (!FamilyIsNew){
        const originalChildren = family.children;
        const newChildren = await processChildren(originalChildren);
        const response = await updateFamily(family);
        const isUpdated = response.success;
        if(isUpdated){
          const newFamily = response.content;
          newFamily.children = newChildren;
          return newFamily;
        } // false 404 -> not found, should be created
    }
      const newFamily = await createFamily({...family, children: children});
      return newFamily;
  }

  /**
   * Processes children, updating, adding, or deleting them as needed.
   *
   * @param {Array} originalChildren - The original children data.
   * @returns {Promise<Array>} - A promise that resolves to the updated children data.
   */
  const processChildren = async (originalChildren) => {
    let updatedChildren = originalChildren;
    const deleteChildren = findUniqueElementsInA(originalChildren, children);
    const addChildren = findUniqueElementsInA(children, originalChildren);
    for (let index = 0; index < deleteChildren.length; index++) {
      const child = deleteChildren[index];
      await deleteChild(child);
      updatedChildren = updatedChildren.filter(item => item.id !== child.id);
    }
    for (let index = 0; index < addChildren.length; index++) {
      let child = addChildren[index];
      child = await addChild(child);
      updatedChildren.push(child);
      
    }
    setChildren(updatedChildren);
    return updatedChildren;
  };

  /**
   * Process phone numbers for a client.
   * @param {Object} client - The client object with phone numbers to process.
   */
  const processPhoneNumbers = async (client) => {
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
    setPhoneNumbers(updatedPhoneNumbers);
    return updatedPhoneNumbers;
  };

  /**
   * Process Patrimony - Retrieves, updates, or adds patrimony data for a client based on the client's ID.
   * @param {number} idClient - The ID of the client.
   * @param {Object} patrimonyData - The patrimony data to be updated or added.
   * @returns {Promise<Object>} The processed patrimony data.
   */
  const processPatrimony = async (idClient, patrimonyData) => {
    let patrimony = await getPatrymony(idClient);
    const patrymonyExists = patrimony != null;
    if (patrymonyExists) {
      patrimony = await updatePatrimony(idClient, patrimonyData);
    } else {
      patrimony = await addPatrimony(idClient, patrimonyData);
    }
    return patrimony;
  };

  /**
   * Create a new client with processed phone numbers.
   * @param {Object} client - The client object to create.
   * @returns {Promise<Object>} - The created client object with processed phone numbers and family data.
   */
  const createRowHandler = async (client) => {
    let createdClient = await createClient(client);
    createdClient.tels = [];
    createdClient.tels =  await processPhoneNumbers(createdClient);
    const patrimony = await processPatrimony(createdClient.id, client.patrimony);
    createdClient = Object.assign(createdClient, {patrimony: patrimony});
    if (client.family){
      createdClient.family = await createFamily({partner_salary:client.family.partner_salary, id: createdClient.id, children: children});
    }
    return createdClient;
  };

  /**
   * Update Row Handler. Updates a client's information when save changes editions.
   * @param {Object} client - The client to be updated.
   * @returns {Promise<Object>} The updated client data.
   */
  const updateRowHandler = async (client) => {
    let updatedClient = await updateClient(client);
    updatedClient.tels =  await processPhoneNumbers(client);
    const patrimony = await processPatrimony(updatedClient.id, client.patrimony);
    updatedClient = Object.assign(updatedClient, {patrimony: patrimony});
    if (client.family) {
      updatedClient.family = await processFamily({...client.family, id:client.id});
      }
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
    let clientRendered = clientData;
    clientRendered.locality = {'id': localityData.id, 'name': localityData.name};
    clientRendered.province = {'id': localityData.province.id, 'name': localityData.province.name};
    clientRendered.nationality = {
      'id': localityData.province.nationality.id, 'name': localityData.province.nationality.name
    };
    if(clientRendered.patrimony){
      Object.keys(clientRendered.patrimony).forEach(subField => {
        clientRendered[`patrimony.${subField}`] = clientRendered.patrimony[subField];
      });
    }
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
      setPhoneNumbers(row?.tels || []);
      setChildren(row?.family?.children || []);
    };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, editable: false},
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
    // PATRIMONY
    { field: 'patrimony.employment', headerName: 'Employment', width: 180, editable: true,
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('employment'),},
    { field: 'patrimony.salary', headerName: 'Salary', width: 100, editable: true, 'type': 'number',
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('salary'),},
    { field: 'patrimony.other_income', headerName: 'Other Incomet', width: 110, editable: true,
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('other_income'),},
    { field: 'patrimony.amount_other_income', headerName: 'Amount Other Incomet', width: 120, editable: true, 'type': 'number',
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('amount_other_income'),},
    { field: 'patrimony.amount_retirement', headerName: 'Amount Retirement', width: 100, editable: true, 'type': 'number',
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('amount_retirement'),},
    { field: 'patrimony.amount_pension', headerName: 'Amount Pension', width: 110, editable: true, 'type': 'number',
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('amount_pension'),},
    { field: 'patrimony.vehicle', headerName: 'Vehicle', width: 120, editable: true,
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('vehicle'),},

      //FAMILY
      { field: 'family.partner_salary', headerName: 'Partner Salary', width: 100, editable: true,
        type: 'number', valueGetter: getSubField, valueSetter: setSubFamilyField('partner_salary'),},
      { field: 'family.children', headerName: 'Children', editable: true, width: 180,
      valueGetter: getSubField,
        valueFormatter: (value) => (value?.value?.length || 0 ) + " children",
        renderEditCell: (params) => {
          return(
            <div>
            <Button
              variant="text"
              color="primary"
              startIcon={<FamilyRestroomIcon />}
              onClick={() => setIsFamilyDialogOpen(true)}
            >
            Manage Family
            </Button>
            <ChildrenDialog
              open={isFamilyDialogOpen}
              onClose={() => setIsFamilyDialogOpen(false)}
              children={children}
              onUpdateChildren={setChildren}
              familyID={params?.row?.id}
            />
          </div>
        )},
      },
];

function getSubField(params) {
  const [fieldName, subFieldName] = params?.field?.toString().split('.')
  const field =  params?.row[fieldName]
  return field? field[subFieldName] : null;
};

function setSubPatrimonyField(subFieldName) {
  return (params) => {
    const field = { ...params.row.patrimony };
    field[subFieldName] = params.value;
    return { ...params.row, patrimony: field };
  };
};

function setSubFamilyField(subFieldName) {
  return (params) => {
    const field = { ...params.row.family };
    field[subFieldName] = params.value;
    return { ...params.row, family: field };
  };
};


  return (
    <div>
      <BaseGrid
        initialRows={data}
        columns={columns}
        emptyRecord={[]}
        onUpdateRow={updateRowHandler}
        onDeleteRow={deleteClient}
        onCreateRow={createRowHandler}
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
