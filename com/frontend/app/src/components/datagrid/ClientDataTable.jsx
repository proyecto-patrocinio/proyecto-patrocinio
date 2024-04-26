import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BaseGrid from './BaseGrid';
import {
  addChild, addPatrimony, addPhoneNumer, createClient,
  createFamily, deleteChild, deleteClient, deletePhoneNumer, getPatrymony,
  updateClient, updateFamily, updatePatrimony
} from '../../utils/client';
import { findUniqueElementsInA, formatDateToString } from '../../utils/tools';
import { getLocalityByID, getLocalityList, getNationalityList, getProvinceList } from '../../utils/locality';
import PhoneNumbersDialog from '../PhoneNumbersDialog';
import { AutocompleteCell } from '../AutocompleteCell';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ChildrenDialog from '../ChildrenDialog';
import { CONSULTANCY_GROUP_NAME, Notification } from '../../sockets/Notification';


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
    { field: 'postal', 'type': 'number', headerName: 'Código Postal', width: 80, editable: true },
    { field: 'address', headerName: 'Dirección', width: 150, editable: true },
    {
      field: 'marital_status', headerName: 'Estado Civil', width: 120, editable: true,
      type: 'singleSelect',
      valueOptions: [
        {value: 'SINGLE', label: 'Soltero/a'},
        {value: 'MARRIED', label: 'Casado/a'},
        {value: 'DIVORCED', label: 'Divorciado/a'},
        {value: 'WIDOWER', label: 'Viudo/a'},
      ]
    },
    {
      field: 'housing_type', headerName: 'Vivienda', width: 200, editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: 'HOUSE', label: 'Casa' },
        { value: 'DEPARTMENT', label: 'Departamento' },
        { value: 'TRAILER', label: 'Remolque' },
        { value: 'STREET_SITUATION', label: 'Situación de calle' },
      ]
    },
    {
      field: 'studies', headerName: 'Education Level', width: 180, editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: 'INCOMPLETE_PRIMARY', label: 'Primario incompleto' },
        { value: 'COMPLETE_PRIMARY', label: 'Primario completo' },
        { value: 'INCOMPLETE_SECONDARY', label: 'Secundario incompleto' },
        { value: 'COMPLETE_SECONDARY', label: 'Secundario completo' },
        { value: 'INCOMPLETE_TERTIARY', label: 'Terciario incompleto' },
        { value: 'COMPLETE_TERTIARY', label: 'Terciario completo' },
        { value: 'INCOMPLETE_UNIVERSITY', label: 'Universidad incompleta' },
        { value: 'COMPLETE_UNIVERSITY', label: 'Univercidad completa' }
      ]
    },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    {
      field: 'id_type', headerName: 'Tipo de documento', width: 100, editable: true,
      type: 'singleSelect',
      valueOptions: [
        {value: 'DOCUMENT', label: 'DNI'},
        {value: 'PASSPORT', label: 'Pasaporte'},
      ]
    },
    { field: 'id_value', headerName: 'Num. Documento', width: 120, editable: true },
    { field: 'first_name', headerName: 'Nombre', width: 150, editable: true },
    { field: 'last_name', headerName: 'Apellido', width: 150, editable: true },
    {
      field: 'birth_date',  headerName: 'Nacimiento', width: 100,
      editable: true, type: 'date',
      valueGetter: ({ value }) => value && new Date(value),
      valueFormatter: (value) =>  value?.value && formatDateToString(value.value)
    },
    {
      field: 'sex', headerName: 'Sexo', width: 110, editable: true,
      type: 'singleSelect',
      valueOptions: [
        {value: 'MALE', label: 'Masculino'},
        {value: 'FEMALE', label: 'Femenino'},
      ]
    },
    { field: 'nationality', headerName: 'Nacionalidad',
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
    { field: 'province', headerName: 'Provincia', editable: true,  width: 200,
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
    { field: 'locality', headerName: 'Localidad',
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
      headerName: 'Tel',
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
          Editar Tel
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
    { field: 'patrimony.employment', headerName: 'Empleo', width: 180, editable: true,
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('employment'),},
    { field: 'patrimony.salary', headerName: 'Salario', width: 100, editable: true, 'type': 'number',
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('salary'),},
    { field: 'patrimony.other_income', headerName: 'Otros ingresos', width: 110, editable: true,
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('other_income'),},
    { field: 'patrimony.amount_other_income', headerName: 'Ingreso por otros ingresos', width: 130, editable: true, 'type': 'number',
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('amount_other_income'),},
    { field: 'patrimony.amount_retirement', headerName: 'Ingreso por jubilación', width: 130, editable: true, 'type': 'number',
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('amount_retirement'),},
    { field: 'patrimony.amount_pension', headerName: 'Ingreso por pensión', width: 120, editable: true, 'type': 'number',
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('amount_pension'),},
    { field: 'patrimony.vehicle', headerName: 'Vehiculos', width: 120, editable: true,
      valueGetter: getSubField, valueSetter: setSubPatrimonyField('vehicle'),},

      //FAMILY
      { field: 'family.partner_salary', headerName: 'Salario de la pareja', width: 125, editable: true,
        type: 'number', valueGetter: getSubField, valueSetter: setSubFamilyField('partner_salary'),},
      { field: 'family.children', headerName: 'Hijos', editable: true, width: 180,
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
              Editar Familia
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
      <Notification channelName={CONSULTANCY_GROUP_NAME}/>
    </div>
  );
};

export default ClientDataTable;
