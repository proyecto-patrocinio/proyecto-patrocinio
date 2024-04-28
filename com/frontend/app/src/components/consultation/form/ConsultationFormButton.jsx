/* ConsultationForm Component
*
* This component provides a button that opens a dialog containing a form with required fields.
* The form includes fields for "Description," "Opponent," "Tag," and "Client."
* When the form is submitted, it validates the input and displays error messages if necessary.
*
* @component ConsultationFormButton
*/

import React, { useState, useEffect } from 'react';
import { TextField, Grid} from '@mui/material';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import {createConsultation} from '../../../utils/caseTaker'
import AddButton from '../../AddButton';
import SimpleDialog from '../../SimpleDialog';
import { getClientDNI2ID } from '../../../utils/tools';


/**
 * ConsultationForm Component
 *
 * This component provides a button that, when clicked, opens a dialog containing a form for loading consultation data.
 * The form includes the following fields:
 *
 * - Description: A text field for entering a description of the consultation.
 * - Opponent: A text field for specifying the opponent or party involved in the consultation.
 * - Tag: A text field for adding tags or labels to categorize the consultation.
 * - Client: A numeric field for entering the client ID, which should be a valid number.
 *
 * It ensures that all required fields are filled, and it validates the client field as a valid number. If there are validation errors,
 * error messages are displayed.
 * 
 * @component ConsultationFormButton
 */
const ConsultationFormButton = ({addNewConsultation}) => {
  const [clientDNI2ID, setClientDNI2ID] = useState([])
  const [formData, setFormData] = useState({
    description: '',
    opponent: '',
    tag: '',
    client: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState({
    description: '',
    opponent: '',
    tag: '',
    client: '',
    all: '',
  });


  useEffect(() => {
    const fetchConsultancy = async () => {
        const clientDNItoIdMapping = await getClientDNI2ID();
        setClientDNI2ID(clientDNItoIdMapping);
    };

    fetchConsultancy();

  }, []);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: '' }); // Clear error when modifying the field
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    let hasError = false;

    // Validate required fields
    const requiredFields = ['description', 'opponent', 'tag', 'client'];
    const newError = {};

    requiredFields.forEach((field) => {
      if (formData[field].trim() === "") {
        newError[field] = 'Este campo es requerido';
        hasError = true;
      }
    });

    if (!clientDNI2ID[formData.client]) {
      newError.client = 'No existe un consultante con ese ID';
    } else {
      formData.client = clientDNI2ID[formData.client] // Set ID of the client
    }

    if (hasError) {
      setError(newError);
    } else {

      //Create Consultation in backend
      const response = await createConsultation(
        formData['description'],
        formData['opponent'],
        formData['tag'],
        formData['client']
      )

      if (!response.success) {
        setError(response.content);

      } else {
        console.debug('Form data submitted:', formData);
        addNewConsultation(response.content);
        setFormData({
          description: '',
          opponent: '',
          tag: '',
          client: '',
          all: '',
        });
        setIsDialogOpen(false);
        setError({
          description: '',
          opponent: '',
          tag: '',
          client: '',
          all: '',
        });
      }
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setError({
      description: '',
      opponent: '',
      tag: '',
      client: '',
      all: '',
    }); // Clear error messages
  };

  return (
    <div>
      {/* Button to open the dialog */}
      <AddButton title={"Agregar nueva consulta"} onClick={handleOpenDialog}/>
      <SimpleDialog
        title={"Cargar nueva consulta"}
        description={"Por favor, ingresa los siguientes datos para cargar el formulario:"}
        onClose={handleCloseDialog}
        onAccept={handleSubmit}
        isOpen={isDialogOpen}
      >
      <br/>
       {/* Form dialog */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  label="Descripción"
                  name="description"
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  error={!!error.description}
                  helperText={error.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Oponente"
                  name="opponent"
                  variant="outlined"
                  value={formData.opponent}
                  onChange={handleChange}
                  required
                  error={!!error.opponent}
                  helperText={error.opponent}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Etiqueta"
                  name="tag"
                  variant="outlined"
                  value={formData.tag}
                  onChange={handleChange}
                  required
                  error={!!error.tag}
                  helperText={error.tag}
                />
              </Grid>
              <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={Object.keys(clientDNI2ID)} // DNI client list options
                value={formData.client} // Selected Client DNI
                onChange={(event, newDNIValue) => {
                  const selectedId = newDNIValue;
                  handleChange({ target: { name: 'client', value: selectedId || '' } });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Consultante"
                    name="client"
                    variant="outlined"
                    required
                    error={!!error.client}
                    helperText={error.client}
                  />
                )}
              />
              </Grid>
            {/*Show Top Error message*/}
            </Grid>
            {error.all && (
              <Typography variant="caption" color="error">
                {error.all}
              </Typography>
            )}
          </form>
      </SimpleDialog>
    </div>
  );
};

export default ConsultationFormButton;
