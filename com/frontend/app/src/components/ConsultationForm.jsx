/* ConsultationForm Component
*
* This component provides a button that opens a dialog containing a form with required fields.
* The form includes fields for "Description," "Opponent," "Tag," and "Client."
* When the form is submitted, it validates the input and displays error messages if necessary.
*
* @component ConsultationFormButton
*/

import React, { useState } from 'react';
import { TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import {createConsultation} from './utils/caseTaker'


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
const ConsultationFormButton = () => {
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
      if (formData[field].trim() === '') {
        newError[field] = 'This field is required';
        hasError = true;
      }
    });

    if (isNaN(formData.client)) {
      newError.client = 'Must be a valid number';
      hasError = true;
    }


    if (!hasError) {

      //Create Consultation in backend
      const response = await createConsultation(
        formData['description'],
        formData['opponent'],
        formData['tag'],
        formData['client']
      )

      if (!response.success) {
        newError.all = response.content
        setError(newError);

      } else {
        console.debug('Form data submitted:', formData);
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
      <Tooltip title="Add New Consultation">
        <IconButton aria-label="show-form" color="primary" onClick={handleOpenDialog}>
          <AddCircleIcon />
        </IconButton>
      </Tooltip>

       {/* Form dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Load New Consultation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following details to load the form:
          </DialogContentText>
          <br/>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
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
                  label="Opponent"
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
                  label="Tag"
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
                <TextField
                  fullWidth
                  label="Client"
                  name="client"
                  variant="outlined"
                  type="number"
                  value={formData.client}
                  onChange={handleChange}
                  required
                  error={!!error.client}
                  helperText={error.client}
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
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConsultationFormButton;
