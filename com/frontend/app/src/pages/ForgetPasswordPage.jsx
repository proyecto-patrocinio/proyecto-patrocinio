import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Avatar, Grid, Link } from '@mui/material';
import AlertSnackbar from '../components/AlertSnackbar';
import Copyright from '../components/Copyright';
import { sendResetPasswordEmail } from '../utils/user';
import { PATH_ROOT } from '../utils/constants';


const theme = createTheme();

const COUNT_DOWN_SEC = 15

/**
 * ForgetPasswordPage - A React component for handling password reset requests.
 */
function ForgetPasswordPage() {
    const [email, setEmail] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [success, setSuccess] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [countdown, setCountdown] = useState(COUNT_DOWN_SEC);


    React.useEffect(() => {
        if (countdown > 0 && isButtonDisabled) {
            const countdownInterval = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => {
                clearInterval(countdownInterval);
            };
        } else {
            setButtonDisabled(false);
            setCountdown(COUNT_DOWN_SEC);
        }
    }, [countdown, isButtonDisabled]);

    const handlePasswordChange = (event) => {
        setEmail(event.target.value);
    };

    const handleCloseSuccessSnackbar = () => {
        setAlertMessage('');
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault(); // Prevent page reload by default
        const response = await sendResetPasswordEmail(email);
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
                        Password Reset
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Please enter your email to search for your account.
                    </Typography>
                    <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 4 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={handlePasswordChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isButtonDisabled}
                            sx={{ mt: 3 }}
                        >
                            {isButtonDisabled ? `Resend in ${countdown} seconds` : 'Send Password Reset Email'}
                        </Button>
                        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Grid item>
                                <Link href={PATH_ROOT} variant="body2">
                                    Back to Home
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

export default ForgetPasswordPage;
