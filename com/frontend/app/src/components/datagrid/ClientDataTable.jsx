import React from 'react';
import BaseGrid from './BaseGrid';


/**
 * A React component that displays client data in a table using Material-UI DataGrid.
 *
 * @param {Object[]} data - An array of client data objects to be displayed in the table.
 * @returns {JSX.Element} The ClientDataTable component.
 */
function ClientDataTable({ data }) {

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
    { field: 'locality', headerName: 'Locality', width: 180, editable: true },
  ];


  return (
    <div>
      <BaseGrid
        initialRows={data}
        columns={columns}
        emptyRecord={[]}
      />
    </div>
  );
};

export default ClientDataTable;
