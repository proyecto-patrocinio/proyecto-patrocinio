import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, ThemeProvider, Typography, createTheme, Divider, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Dashboard from '../containers/Dashboard';
import { changePassword, updateUser } from '../utils/user';
import AlertSnackbar from '../components/AlertSnackbar';
import { useUserContext } from '../context/UserContext';


/**
 * React component for the Settings page, allowing users to view and edit their profile information,
 * as well as change their password.
 */
const SettingsPage = () => {
  const userContext = useUserContext();
  const [userInfo, setUserInfo] = useState({});

  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(true);

  useEffect(() => {
    setUserInfo(userContext.user);
  }, [userContext])

  /**
   * Handles saving changes to the user profile.
   * Updates the user information and sends a request to the API to update the user.
   */
  const saveChanges = async () => {
    const response = await updateUser(editedFirstName, editedLastName);
    setAlertSuccess(response.success);
    setAlertMessage(response.message);
    if (response.user) {
      const newUser = {
        ...userInfo,
        first_name: editedFirstName,
        last_name: editedLastName,
      }
      setUserInfo(newUser);
      userContext.setUser(newUser);
    };
    setEditMode(false);
  };

  /**
   * Handles saving changes to the password user.
   * Updates the password user and sends a request to the API to update the password.
   */
  const savePasswordChanges = async () => {
    const response = await changePassword(newPassword, confirmNewPassword);
    setAlertMessage(response.message);
    setAlertSuccess(response.success);
    setChangePasswordMode(false);
  };

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Dashboard title="SETTINGS">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, color: '#1976D2' }}>
                User Profile
              </Typography>

              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="h6" color="primary">
                  User Data
                </Typography>
                <p><strong>Username:</strong> {userInfo.username}</p>
                <p><strong>First Name:</strong> {userInfo.first_name}</p>
                <p><strong>Last Name:</strong> {userInfo.last_name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {editMode ? (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        label="New First Name"
                        fullWidth
                        value={editedFirstName}
                        onChange={(e) => setEditedFirstName(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="New Last Name"
                        fullWidth
                        value={editedLastName}
                        onChange={(e) => setEditedLastName(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={saveChanges}
                        startIcon={<SaveIcon />}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setEditMode(true)}
                      startIcon={<EditIcon />}
                      fullWidth
                    >
                      Edit Profile
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Button variant="outlined" color="primary" onClick={()=>{setChangePasswordMode(true)}} fullWidth>
                    Change Password
                  </Button>
                </Grid>
              </Grid>

              {changePasswordMode && (
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={savePasswordChanges}
                      startIcon={<SaveIcon />}
                      fullWidth
                    >
                      Save Password
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
        <AlertSnackbar key={"alert-settings"} onClose={() => {setAlertMessage("")}} message={alertMessage} severity={alertSuccess ? "success" : "error"}/>
      </Dashboard>
    </ThemeProvider>
  );
};

export default SettingsPage;
