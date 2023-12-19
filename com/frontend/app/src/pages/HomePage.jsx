import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import { Box, Typography, Button, Modal, Paper, Fade, Backdrop } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AssignmentIcon from '@mui/icons-material/Assignment';

const theme = createTheme({
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h4: {
            fontWeight: 800,
            fontSize: '3.5rem',
            marginBottom: '1.5rem',
            color: '#1a73e8',
        },
        body1: {
            fontSize: '1.4rem',
            lineHeight: 1.8,
            marginBottom: '2rem',
            color: '#333',
        },
    },
    spacing: 8,
    palette: {
        primary: {
            main: '#1a73e8',
        },
        secondary: {
            main: '#34a853',
        },
    },
});

const TutorialModal = ({ open, handleClose }) => {
    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const closeModal = () => {
        setStep(1);
        handleClose();
    }

    const handleStart = () => {
        setStep(1);
    };

    const steps = [
        'On the left, you will find the dropdown menu to switch pages.',
        'Settings: This page allows you to view and change user information.',
        'Consultancy: This page allows case takers to create, submit, and manage cases.',
        'Control Panel: On this page, you can view client and consultation information in a table format.',
        'Board: Here, you will find a list of the boards you have access to. In each board, professors can record case progress.',
    ];

    return (
        <Modal
            open={open}
            onClose={closeModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Paper sx={{ padding: 4, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Welcome to the Tutorial!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Step {step}:</strong> {steps[step - 1]}
                    </Typography>
                    {step < steps.length && (
                        <Button variant="contained" color="secondary" onClick={handleNextStep}>
                            Next
                        </Button>
                    )}
                    {step === steps.length && (
                        <Button variant="contained" color="secondary" onClick={handleStart}>
                            Start
                        </Button>
                    )}
                </Paper>
            </Fade>
        </Modal>
    );
};

const HomePage = () => {
    const [tutorialOpen, setTutorialOpen] = useState(false);

    const handleTutorialOpen = () => {
        setTutorialOpen(true);
    };

    const handleTutorialClose = () => {
        setTutorialOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Dashboard>
                <Box sx={{ m: 4, maxWidth: '800px', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" gutterBottom>
                        <InfoIcon fontSize="inherit" style={{ verticalAlign: 'middle', marginRight: '1rem', color: '#4285F4' }} />
                        Case Management System
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                    <p>
                        <AssignmentIcon fontSize="inherit" style={{ verticalAlign: 'middle', marginRight: '1rem', color: '#4285F4' }} />
                        Welcome! This platform allows lawyers and law professors to efficiently manage legal cases.
                    </p>
                    <p>
                        CaseManager is a comprehensive tool designed to simplify and optimize case management in academic and professional environments.
                        <br/>
                        <strong>Main Features:</strong>
                        <ol>
                            <li>
                                <strong>Client and Case Management:</strong>
                                <ul>
                                    <li>Case handlers can easily add clients and specific details for each case, ensuring clear and complete data entry.</li>
                                    <li>The intuitive interface allows quick recording of essential information, such as key dates, client details, and detailed case descriptions.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Commission Board:</strong>
                                <ul>
                                    <li>Cases can be submitted to a commission board, where professors and commission heads have an overview of all pending cases.</li>
                                    <li>Effective organization facilitates quick review and assignment of cases to the respective responsible parties.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Approval and Rejection:</strong>
                                <ul>
                                    <li>Professors and commission heads can review assigned cases, make informed decisions, and efficiently approve or reject each request.</li>
                                    <li>Automatic notifications keep all users updated on the status of their cases.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Comprehensive Administration:</strong>
                                <ul>
                                    <li>Full administration features allow users to track the status of each case, record significant changes, and maintain a detailed history of actions taken.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Tracking with Comments and Files:</strong>
                                <ul>
                                    <li>The integrated comment system facilitates communication among those involved in a case, enabling clear and documented information exchange.</li>
                                    <li>Relevant files can be attached to support shared information.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Table Format Visualization:</strong>
                                <ul>
                                    <li>All cases and clients are presented in a clear and organized table format, providing an easily understandable overview.</li>
                                    <li>Filtering and search functions make it easy to locate specific information.</li>
                                </ul>
                            </li>
                        </ol>
                    </p>

                    </Typography>
                    <Button variant="contained" color="secondary" sx={{ width: 'fit-content' }} onClick={handleTutorialOpen}>
                        Start
                    </Button>
                    <TutorialModal open={tutorialOpen} handleClose={handleTutorialClose} />
                    </Box>
            </Dashboard>
        </ThemeProvider>
    );
};

export default HomePage;
