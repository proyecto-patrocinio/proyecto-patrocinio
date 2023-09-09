import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

/**
 * Component to render a form for loading data with specified fields.
 *
 * @component
 */
const LoadForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    opponent: '',
    tag: '',
    client: '',
  });
  const [isFormVisible, setIsFormVisible] = useState(false); // Estado para controlar la visibilidad del formulario

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form data submitted:', formData);
    setFormData({
      description: '',
      opponent: '',
      tag: '',
      client: '',
    });
  };

  const handleShowForm = () => {
    setIsFormVisible(true); // Mostrar el formulario al hacer clic en el botón
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleShowForm}>
        Mostrar formulario
      </Button>

      {/* Renderizar el formulario solo si isFormVisible es true */}
      {isFormVisible && (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
          <Typography variant="h6" gutterBottom>
            Load Form
          </Typography>
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
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}
    </div>
  );
};

export default LoadForm;
