import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, List, ListItem, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { getRandomNumber } from '../utils/tools';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { AutocompleteCell } from './AutocompleteCell';
import { getLocalityList, getNationalityList, getProvinceList } from '../utils/locality';
import AlertSnackbar from '../../AlertSnackbar.jsx';


const EMPTY_CHILDREN = {
  id:0,
  name: "",
  age:0,
  locality:null,
  address:"",
  family_client_user:0
};

/**
 * A component to manage child information in a dialog.
 * @param {boolean} open - Whether the dialog is open.
 * @param {function} onClose - Function to close the dialog.
 * @param {Array} childrens - List of children.
 * @param {function} onUpdateChildren - Function to update the list of children.
 */
function ChildrenDialog({ open, onClose, childrens, onUpdateChildren, familyID }) {
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
      newChild.age.trim() !== 0
      && newChild.name !== ''
      && newChild.address !== ''
      && geographyModel?.locality != null
      && familyID > 0
    ) {
      const child = {
        ...newChild,
        id: getRandomNumber(Number.MAX_SAFE_INTEGER),
        locality: geographyModel?.locality,
        family_client_user: familyID
      };
      onUpdateChildren([...childrens, child]);
    };
    setNewChild(EMPTY_CHILDREN);
    console.error("Error submitting new child.")
    setAlertMessage("Please complete all required fields before submitting.");
  };

  const handleDelete = (index) => {
    const updateChildrens = [...childrens];
    updateChildrens.splice(index, 1);
    onUpdateChildren(updateChildrens);
  };

  const handleChange = (field, value) => {
    setNewChild({ ...newChild, [field]: value });
  };

  const closeHandler = () => {
    setNewChild(EMPTY_CHILDREN);
    onClose();
  };

  return (
    <Dialog open={open} onClose={closeHandler}>
      <DialogContent>
        <List>
          {childrens && childrens?.map((children, index) => (
            <ListItem key={index}>
              <strong>Name:</strong> {children?.name}
              <strong>Age:</strong> {children?.age}
              <strong>Locality:</strong> {children?.locality}
              <strong>Adress:</strong> {children?.address}
              <IconButton onClick={() => handleDelete(index)} color="secondary">
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Name"
            fullWidth
            value={newChild.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="Age"
            fullWidth
            type="number"
            value={newChild.age}
            onChange={(e) => handleChange("age", e.target.value)}
          />
          <AutocompleteCell optionsNameID={nationalityOptions} model={geographyModel?.nationality}
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
          handleChange={(id, name) => {
            const newModel = {};
            newModel['nationality'] = geographyModel?.nationality;
            newModel['province'] = {id: id, name: name};
            newModel['locality'] = null;
            setGeographyModel(newModel);
          }}
        />
        <AutocompleteCell optionsNameID={localityOptions}  model={geographyModel?.locality}
          handleChange={(id, name) =>{
            const newModel = {}
            newModel['nationality'] = geographyModel?.nationality;
            newModel['province'] = geographyModel?.province;
            newModel['locality'] = {id: id, name: name};
            setGeographyModel(newModel);
          }}
        />
          <TextField
            label="Address"
            fullWidth
            value={newChild.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          <Button onClick={submitHandler} color="primary" startIcon={<AddIcCallIcon />} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler} startIcon={<CloseIcon />} />
      </DialogActions>
      <AlertSnackbar onClose={() => {setAlertMessage("")}} message={alertMessage} severity={'error'}/>
    </Dialog>
  );
}

export default ChildrenDialog;
