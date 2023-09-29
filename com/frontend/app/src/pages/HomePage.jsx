import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import { Box, Typography } from '@mui/material';

const theme = createTheme();
export default function HomePage( ) {

    return (
        <ThemeProvider theme={theme}>
            <Dashboard>
                <Box sx={{m:8}}>
                <Typography variant="h4" gutterBottom>
                    Case Management System
                </Typography>
                <Typography variant="body1" gutterBottom >
                    <p>
                    The case management application for the UBA legal sponsorship project is a platform that enables
                    lawyers and law students to manage their assigned legal cases more efficiently. 
                    </p>
                    <p>
                    The application includes features such as case management, case assignment, communication, scheduling, 
                    documentation, and statistics. These features allow users to store and access relevant information, 
                    schedule appointments and hearings, communicate with other team members, generate reports 
                    and statistics to assess team performance, and make data-driven decisions. In summary, 
                    the case management application enhances the efficiency and effectiveness of the UBA legal sponsorship project, 
                    enabling the delivery of better service to clients and achieving better outcomes in the courts."
                    </p>
                </Typography>
                </Box>
            </Dashboard>
        </ThemeProvider>
    );
};