import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import { getClientList } from '../utils/client';
import ClientDataTable from '../components/ClientDataTable';

const theme = createTheme();
export default function ControlPanelClient( ) {
    const [clientList, setClientList] = useState([]);

    useEffect(() =>{
        const fetchClients = async() => {
            const clientList = await getClientList();
            setClientList(clientList);
        }
        fetchClients();
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Dashboard title={"Control Panel - Clients"}>
            <ClientDataTable data={clientList} />
            </Dashboard>
        </ThemeProvider>
    );
};