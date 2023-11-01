import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Avatar, Grid, Link } from '@mui/material';
import { sendConfirmationEmail } from '../utils/user';
import AlertSnackbar from '../components/AlertSnackbar';
import Copyright from '../components/Copyright';
import { PATH_ROOT } from '../utils/constants';

const theme = createTheme();

const COUNT_DOWN_SEC = 15


function EmailConfirmationPage() {
    const [email, setEmail] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [countdown, setCountdown] = useState(COUNT_DOWN_SEC);
    const [success, setSuccess] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');

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

    const handleCloseSuccessSnackbar = () => {
        setAlertMessage('');
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSendEmail = async (event) => {
        event.preventDefault(); // Prevent page reload by default
        const response = await sendConfirmationEmail(email);
        setSuccess(response.ok);
        setAlertMessage(response.detail);
        if(response.ok){
            setButtonDisabled(true);
            setCountdown(COUNT_DOWN_SEC);
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
                <EmailIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Email Confirmation
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
                Please enter your email address below, and we'll send a confirmation email to you.
            </Typography>
            <Box component="form" onSubmit={handleSendEmail} sx={{ mt: 4 }}>
                <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                />
                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isButtonDisabled}
                sx={{ mt: 3 }}
                >
                {isButtonDisabled ? `Resend in ${countdown} seconds` : 'Send Confirmation Email'}
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
            severity = { success ? 'success' : 'error'}
        />
        <Copyright sx={{ mt: 5 }} />
        </Container>
        </ThemeProvider>
    );
};

export default EmailConfirmationPage;
