import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, List, ListItem, IconButton, Select, MenuItem, InputLabel, FormControl, Divider, Typography, Paper, Grid, Box, Avatar } from '@mui/material';
import { Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { getRandomNumber } from '../utils/tools';
import { AutocompleteCell } from './AutocompleteCell';
import { getLocalityList, getNationalityList, getProvinceList } from '../utils/locality';
import AlertSnackbar from './AlertSnackbar';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { DatePicker } from '@mui/x-date-pickers';


const EMPTY_CHILD = {
  id:0,
  first_name: "",
  last_name: "",
  id_type: "",
  id_value: "",
  locality:null,
  sex:null,
  birth_date:null,
  address:"",
  client_user:0
};


/**
 * A component to manage child information in a dialog.
 * @param {boolean} open - Whether the dialog is open.
 * @param {function} onClose - Function to close the dialog.
 * @param {Array} children - List of child.
 * @param {function} onUpdateChildren - Function to update the list of children.
 * @param {Number} clientID - ID of client.
 */
function ChildrenDialog({ open, onClose, children, onUpdateChildren, clientID }) {
  const [newChild, setNewChild] = useState(EMPTY_CHILD);
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
      && clientID
    ) {
      const child = {
        ...newChild,
        id: ("NEW" + getRandomNumber(Number.MAX_SAFE_INTEGER)),
        locality: {...geographyModel?.locality, province: {...geographyModel?.province, nationality: geographyModel?.nationality}},
        client_user: clientID
      };
      child.birth_date = child?.birth_date?.$d?.toISOString().split('T')[0];
      onUpdateChildren([...children, child]);
      setNewChild(EMPTY_CHILD);
    } else {
      setNewChild(EMPTY_CHILD);
      console.error("Error al enviar nuevo hijo.")
      setAlertMessage("Por favor completa todos los campos obligatorios antes de enviar.");
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
    setNewChild(EMPTY_CHILD);
    onClose();
  };

  return (
    <Dialog maxWidth={'md'}  open={open} onClose={closeHandler} key={"dialog-family-" + clientID}>
      <DialogContent>
        <List>
          {children && children?.map((child, index) => (
            <Paper elevation={3} key={index} style={{ marginBottom: '15px' }}>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={2}>
                      <Box display="flex" alignItems="center">
                        <Avatar>{child?.first_name ? child?.first_name[0] : 'A'}</Avatar>
                      </Box>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="h6">
                        {child?.first_name} {child?.last_name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>ID:</strong> {child?.id} |{' '}
                        <strong>Tipo de documento:</strong> {child?.id_type} |{' '}
                        <strong>Num. de documento:</strong> {child?.id_value} |{' '}
                        <strong>Localidad:</strong>{' '}
                          {child?.locality?.province?.nationality?.name},{' '}
                          {child?.locality?.province?.name},{' '}
                          {child?.locality?.name} |{' '}
                        <strong>Dirección:</strong> {child?.address} |{' '}
                        <strong>Sexo:</strong> {child?.sex} |{' '}
                        <strong>Nacimiento:</strong>{' '}
                        {child?.birth_date}
                      </Typography>
                      <IconButton onClick={() => handleDelete(index)} color="secondary">
                      <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              </Paper>
          ))}
        </List>

        <Divider />

        <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>
          Agregar nuevo hijo
        </Typography>


        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Information Children Section*/}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <TextField
              key={"form-child-first-name"}
              label="Nombre"
              fullWidth
              value={newChild?.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
            <TextField
              key={"form-child-last-name"}
              label="Apellido"
              fullWidth
              value={newChild?.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="form-child-id-type">Tipo de documento</InputLabel>
              <Select
                labelId={"form-child-id-type"}
                label="id_type"
                value={newChild?.id_type}
                onChange={(e) => handleChange("id_type",  e.target.value)}
              >
                <MenuItem value={"PASSPORT"}>Pasaporte</MenuItem>
                <MenuItem value={"DOCUMENT"}>DNI</MenuItem>
              </Select>
            </FormControl>
            <TextField
              key={"form-child-id-value"}
              label="Num. de documento"
              fullWidth
              value={newChild?.id_value}
              onChange={(e) => handleChange("id_value", e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="form-child-sex">Sexo</InputLabel>
              <Select
                labelId={"form-child-sex"}
                label="sex"
                value={newChild?.sex}
                onChange={(e) => handleChange("sex",  e.target.value)}
              >
                <MenuItem value={"FEMALE"}>Femenino</MenuItem>
                <MenuItem value={"MALE"}>Masculino</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* geography Section */}
          <div style={{ display: 'flex', flexDirection: 'row',  gap: '10px'}}>
            <AutocompleteCell optionsNameID={nationalityOptions} model={geographyModel?.nationality}
              key={"form-child-nationality"}
              fullWidth
              label={"Nacionalidad"}
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
              label={"Provincia"}
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
              label={"Localidad"}
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
              label="Dirección"
              fullWidth
              value={newChild?.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <DatePicker
              key={"form-child-birth_date"}
              label="Nacimiento"
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
