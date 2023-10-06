import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import ConsultationDataTable from '../components/datagrid/ConsultionDataTable';
import { getConsultationList } from '../utils/caseTaker';

const theme = createTheme();


export default function ControlPanelConsultation() {
    const [consultationList, setConsultationList] = useState([])

    useEffect(() =>{
        const fetchClients = async() => {
            const clientList = await getConsultationList();
            setConsultationList(clientList);
        }
        fetchClients();
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Dashboard title={"Control Panel - Consultations"}>
                <ConsultationDataTable data={consultationList} />
            </Dashboard>
        </ThemeProvider>
    );
};