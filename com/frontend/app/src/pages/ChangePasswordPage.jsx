import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Avatar, Grid, Link } from '@mui/material';
import AlertSnackbar from '../components/AlertSnackbar';
import { PATH_ROOT } from '../utils/constants';
import Copyright from '../components/Copyright';
import { sendChangePassword } from '../utils/user';

const theme = createTheme();

/**
 * ChangePasswordPage - A React component for changing the user's password.
 */
function ChangePasswordPage() {
    const { uid, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [success, setSuccess] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleCloseSuccessSnackbar = () => {
        setAlertMessage('');
    };

    const handlePasswordChangeSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setSuccess(false);
            setAlertMessage("Las contraseñas no coinciden");
            return;
        }

        const response = await sendChangePassword(password, uid, token);

        setSuccess(response.ok);
        setAlertMessage(response.detail);
        if (response.ok) {
            setButtonDisabled(true);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '80vh',
                    }}
                >
                    <Avatar sx={{ backgroundColor: 'secondary.main', p: 2 }}>
                        <LockOpenIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Cambiar Contraseña
                    </Typography>
                    <Box component="form" onSubmit={handlePasswordChangeSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Nueva contraseña"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirmar nueva contraseña"
                            type="password"
                            variant="outlined"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isButtonDisabled}
                        >
                            {isButtonDisabled ? 'La contraseña ha sido cambiada' : 'Cambiar contraseña'}
                        </Button>
                        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Grid item>
                                <Link href={PATH_ROOT} variant="body2">
                                    Volver al inicio
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <AlertSnackbar
                    message={alertMessage}
                    onClose={handleCloseSuccessSnackbar}
                    severity={success ? 'success' : 'error'}
                />
                <Copyright sx={{ mt: 5 }}/>
            </Container>
        </ThemeProvider>
    );
}

export default ChangePasswordPage;
