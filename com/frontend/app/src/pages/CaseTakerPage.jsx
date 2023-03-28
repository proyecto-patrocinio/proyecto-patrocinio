import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import Board from '../components/Board';

const theme = createTheme();
export default function Consultancy( ) {

    return (
        <ThemeProvider theme={theme}>
            <Dashboard title={"TOMADOR DE CASO"}>
                <Board/>
            </Dashboard>
        </ThemeProvider>
    );
};