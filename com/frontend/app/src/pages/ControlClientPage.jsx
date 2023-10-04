import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';

const theme = createTheme();
export default function ControlPanelClient( ) {

    return (
        <ThemeProvider theme={theme}>
            <Dashboard title={"CONSULTANCY"}>
                Control Panel Client Page
            </Dashboard>
        </ThemeProvider>
    );
};