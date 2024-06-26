import React,{useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../components/Copyright';
import  Alert  from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import { useUserContext } from '../context/UserContext';
import {loginUser} from '../utils/user';
import { PATH_FORGET_PASSWORD } from '../utils/constants';
import logo from '../resources/favicon.ico'
const theme = createTheme();

export default function SignIn( props) {
  const userContext =  useUserContext();
  const [open, setOpen] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onLoginSuccess = (user) => {
    userContext.setUser(user);
    props.setIsLoggedIn(true);
  };

  const onLoginError = (errorMensage) => {
  setLoginError(errorMensage);
  setOpen(true);
  };

  //Conect to API
  const handleValidation = (event) => {
    
      //get data from form
      const data = new FormData(event.currentTarget);
      const data_username = data.get('username');
      const data_password = data.get('password');

      //check if data is empty
    if (data_username === "" || data_password === "") {
      setLoginError("Complete todos los campos.");
      setOpen(true);
    }else {
      setOpen(false);
      const dataUser = {username: data_username, password: data_password};
      loginUser(dataUser, onLoginSuccess, onLoginError);
    }
    return () => {}
  };

  //Handle submit when click on button ("Sign in")
  const handleSubmit = (event) => {
    event.preventDefault();
    handleValidation(event);
  };

  //Handle close alert
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') { 
      return;
    }
    setOpen(false);
  };


  return (
    <ThemeProvider theme={theme}>
    
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {loginError}
              </Alert>
        </Snackbar>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 3, bgcolor: 'secondary.main', width: '60px', height: '60px' }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Avatar>
          <Typography component="h1" variant="h5" align="center" color="primary" gutterBottom>
            Sistema de Gestión de Casos
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="username" 
              label="Nombre de usuario"
              type={"text"}
              id="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password" 
            />
            
            <Button 
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
      
            <Grid container>
              <Grid item xs>
                <Link href={PATH_FORGET_PASSWORD} variant="body2">
                  ¿Olvidaste la contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link href="signup" variant="body2">
                  {"¿No tienes una cuenta? Regístrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
