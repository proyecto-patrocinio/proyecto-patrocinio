import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, List, ListItem, IconButton, Select, MenuItem, InputLabel, FormControl, Divider, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { getRandomNumber } from '../utils/tools';
import { AutocompleteCell } from './AutocompleteCell';
import { getLocalityList, getNationalityList, getProvinceList } from '../utils/locality';
import AlertSnackbar from './AlertSnackbar';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { DatePicker } from '@mui/x-date-pickers';


const EMPTY_CHILDREN = {
  id:0,
  first_name: "",
  last_name: "",
  id_type: "",
  id_value: "",
  locality:null,
  sex:null,
  birth_date:null,
  address:"",
  family_client_user:0
};


/**
 * A component to manage child information in a dialog.
 * @param {boolean} open - Whether the dialog is open.
 * @param {function} onClose - Function to close the dialog.
 * @param {Array} children - List of child.
 * @param {function} onUpdateChildren - Function to update the list of children.
 */
function ChildrenDialog({ open, onClose, children, onUpdateChildren, familyID }) {
  const [newChild, setNewChild] = useState(EMPTY_CHILDREN);
  const [nationalityOptions, setNationalityOptions] = useState(null);
  const [provinceOptions, setProvinceOptions] = useState(null);
  const [localityOptions, setLocalityOptions] = useState(null);
  const [geographyModel, setGeographyModel] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

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

  const submitHandler = (event) => {
    if (
      newChild?.first_name !== ''
      && newChild?.last_name !== ''
      && newChild?.id_type !== ''
      && newChild?.id_value !== ''
      && newChild?.sex !== null
      && newChild?.birth_date !== null
      && newChild?.address !== ''
      && geographyModel?.locality != null
      && familyID > 0
    ) {
      const child = {
        ...newChild,
        id: getRandomNumber(Number.MAX_SAFE_INTEGER),
        locality: geographyModel?.locality,
        family_client_user: familyID
      };
      onUpdateChildren([...children, child]);
      setNewChild(EMPTY_CHILDREN);
    } else {
      setNewChild(EMPTY_CHILDREN);
      console.error("Error submitting new child.")
      setAlertMessage("Please complete all required fields before submitting.");
    }
  };

  const handleDelete = (index) => {
    const updateChildren = [...children];
    updateChildren.splice(index, 1);
    onUpdateChildren(updateChildren);
  };

  const handleChange = (field, value) => {
    setNewChild({ ...newChild, [field]: value });
  };

  const closeHandler = () => {
    setNewChild(EMPTY_CHILDREN);
    onClose();
  };

  return (
    <Dialog maxWidth={'md'}  open={open} onClose={closeHandler} key={"dialog-family-" + familyID}>
      <DialogContent>
        <List>
          {children && children?.map((children, index) => (
            <ListItem key={index}>
              <strong>ID:</strong> {children?.id} <br/>
              <strong>First Name:</strong> {children?.first_name}<br/>
              <strong>Last Name:</strong> {children?.last_name}<br/>
              <strong>ID Type:</strong> {children?.id_type}<br/>
              <strong>ID Value:</strong> {children?.id_value}<br/>
              <strong>Locality:</strong> {children?.locality?.name}<br/>
              <strong>Sex:</strong> {children?.sex}<br/>
              <strong>birth_date:</strong> {children?.birth_date}<br/>
              <strong>Adress:</strong> {children?.address}<br/>
              <IconButton onClick={() => handleDelete(index)} color="secondary">
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>
          Add New Child
        </Typography>


        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Information Children Section*/}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <TextField
              key={"form-child-first-name"}
              label="First Name"
              fullWidth
              value={newChild?.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
            <TextField
              key={"form-child-last-name"}
              label="Last Name"
              fullWidth
              value={newChild?.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="form-child-id-type">ID Type</InputLabel>
              <Select
                labelId={"form-child-id-type"}
                label="id_type"
                value={newChild?.id_type}
                onChange={(e) => handleChange("id_type",  e.target.value)}
              >
                <MenuItem value={"PASSPORT"}>PASSPORT</MenuItem>
                <MenuItem value={"DOCUMENT"}>DOCUMENT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              key={"form-child-id-value"}
              label="ID Value"
              fullWidth
              value={newChild?.id_value}
              onChange={(e) => handleChange("id_value", e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="form-child-sex">Sex</InputLabel>
              <Select
                labelId={"form-child-sex"}
                label="sex"
                value={newChild?.sex}
                onChange={(e) => handleChange("sex",  e.target.value)}
              >
                <MenuItem value={"FEMALE"}>FEMALE</MenuItem>
                <MenuItem value={"MALE"}>MALE</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* geography Section */}
          <div style={{ display: 'flex', flexDirection: 'row',  gap: '10px'}}>
            <AutocompleteCell optionsNameID={nationalityOptions} model={geographyModel?.nationality}
              key={"form-child-nationality"}
              fullWidth
              label={"Nationality"}
              handleChange={
                (id, name) => {
                  const newModel = {};
                  newModel['nationality'] = {id: id, name: name};
                  newModel['locality'] = null;
                  newModel['province'] = null;
                  setGeographyModel(newModel);
              }}
            />
            <AutocompleteCell optionsNameID={provinceOptions} model={geographyModel?.province}
              key={"form-child-province"}
              fullWidth
              label={"Province"}
              handleChange={(id, name) => {
                const newModel = {};
                newModel['nationality'] = geographyModel?.nationality;
                newModel['province'] = {id: id, name: name};
                newModel['locality'] = null;
                setGeographyModel(newModel);
              }}
            />
            <AutocompleteCell optionsNameID={localityOptions}  model={geographyModel?.locality}
              key={"form-child-locality"}
              fullWidth
              label={"Locality"}
              handleChange={(id, name) =>{
                const newModel = {}
                newModel['nationality'] = geographyModel?.nationality;
                newModel['province'] = geographyModel?.province;
                newModel['locality'] = {id: id, name: name};
                setGeographyModel(newModel);
              }}
            />
            <TextField
              key={"form-child-address"}
              label="Address"
              fullWidth
              value={newChild?.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <DatePicker
              key={"form-child-birth_date"}
              label="Birthdate"
              value={newChild?.birth_date}
              onChange={(newValue) => handleChange("birth_date", newValue)}
            />
          <Button onClick={submitHandler} color="primary" startIcon={<PersonAddAltIcon />} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button key={"children-button-close"} onClick={closeHandler} startIcon={<CloseIcon />} />
      </DialogActions>
      <AlertSnackbar key={"children-alert-errors"} onClose={() => {setAlertMessage("")}} message={alertMessage} severity={'error'}/>
    </Dialog>
  );
}

export default ChildrenDialog;
