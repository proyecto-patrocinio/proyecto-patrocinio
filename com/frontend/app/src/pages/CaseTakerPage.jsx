import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import Consultancy from '../containers/Consultancy';

const theme = createTheme();
export default function CaseTaker( ) {

    return (
        <ThemeProvider theme={theme}>
            <Dashboard title={"CONSULTANCY"}>
                <Consultancy/>
            </Dashboard>
        </ThemeProvider>
    );
};