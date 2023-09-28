import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../components/Copyright';
import { SnackbarProvider, useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';

const theme = createTheme();

function Register() {
  const { enqueueSnackbar } = useSnackbar();
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [loading, setLoading] = React.useState(false); 

  //Conect to API
  const handleValidation = async  (event) => {
    setLoading(true);
    //get data from form
    try{
        const data = new FormData(event.currentTarget);
        const data_username = data.get('username');
        const data_password = data.get('password');
        const data_password2 = data.get('password2');
        const data_email = data.get('email');

          //check if data is empty
        if (data_username === "" || data_password === "" || data_email === "" || data_password2 === "") {
          enqueueSnackbar("Complete all fields.", { variant: 'error' });
        }else {

        //send data to API
        const requestURL = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                          + process.env.REACT_APP_PATH_SIGNUP;
        const request = new XMLHttpRequest();
        request.open('POST', requestURL);
        request.setRequestHeader( 'Content-Type', 'application/json')

        request.onreadystatechange = () => { // Call a function when the state changes.
          if (request.readyState === XMLHttpRequest.DONE ) {
            if( request.status === 201){
              const mns = JSON.parse(request.response).detail;
              enqueueSnackbar(mns, { variant: 'success' });
            }
            else { 
              const data = JSON.parse(request.response);
              if (data.username ) enqueueSnackbar(data.username, { variant: 'error' }) ;
              if (data.email ) enqueueSnackbar(data.email, { variant: 'error' }) ;
              if (data.password1 ) enqueueSnackbar(data.password1, { variant: 'error' });
              if (data.password2 ) enqueueSnackbar(data.password2, { variant: 'error' });
              if(data.non_field_errors) enqueueSnackbar(data.non_field_errors, { variant: 'error' });
            }
            // Stop loading
            setLoading(false);
          }
        }
        request.send(
            JSON.stringify({
                "username": data_username,
                "email": data_email,
                "password1": data_password,
                "password2": data_password2,
            }));

      }
      return () => {}
  } catch {
    console.log("Unexpected error occurred during request processing.")
    setLoading(false);
  }
}

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!termsAccepted) {
      enqueueSnackbar("Please accept the terms and conditions.", { variant: 'error' });
    } else {
      handleValidation(event);
    }
  };

  const handleCheckboxChange = (event) => {
    setTermsAccepted(event.target.checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="repeat-password"
                  type="password"
                  id="password2"
                  autoComplete="repeat-password"
                />
              </Grid>
              
              <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="termAndCond" color="primary" onChange={handleCheckboxChange} />}
                label="I have read and accept the terms and conditions."
              />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!termsAccepted || loading}
            >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};


export default function SignUp() {
  return (
    <SnackbarProvider maxSnack={4}>
      <Register />
    </SnackbarProvider>
  );
};
