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
        'A la izquierda, encontrarás el menú desplegable para cambiar de páginas.',
        'Configuración: Esta página te permite ver y cambiar la información del usuario.',
        'Consultoría: Esta página permite a los responsables de casos crear, enviar y gestionar casos.',
        'Panel de Control: En esta página, puedes ver la información de consultantes y consultas en formato de tabla.',
        'Tablero: Aquí encontrarás una lista de los tableros a los que tienes acceso. En cada tablero, los profesores pueden registrar el progreso de los casos.',
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
                       ¡Bienvenido al tutorial!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Paso {step}:</strong> {steps[step - 1]}
                    </Typography>
                    {step < steps.length && (
                        <Button variant="contained" color="secondary" onClick={handleNextStep}>
                            Siguiente
                        </Button>
                    )}
                    {step === steps.length && (
                        <Button variant="contained" color="secondary" onClick={handleStart}>
                            Comenzar
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
                        Sistema de Gestión de Casos
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                    <p>
                        <AssignmentIcon fontSize="inherit" style={{ verticalAlign: 'middle', marginRight: '1rem', color: '#4285F4' }} />
                        ¡Bienvenido! Esta plataforma permite a abogados y profesores de derecho gestionar eficientemente casos legales.
                    </p>
                    <p>
                        Esta herramienta esta diseñada para simplificar y optimizar la gestión de casos en entornos académicos y profesionales.
                        <br/>
                        <strong>Principales Características:</strong>
                        <ol>
                            <li>
                                <strong>Gestión de Consultas y Consultantes:</strong>
                                <ul>
                                    <li>Los gestores de casos pueden agregar fácilmente consultantes y detalles específicos para cada caso, asegurando una entrada de datos clara y completa.</li>
                                    <li>La interfaz intuitiva permite el rápido registro de información esencial, como fechas clave, detalles del consultante y descripciones detalladas del caso.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Junta de Comisión:</strong>
                                <ul>
                                    <li>Los casos pueden ser enviados a una junta de comisión, donde profesores y jefes de comisión tienen una visión general de todos los casos pendientes.</li>
                                    <li>La organización efectiva facilita la rápida revisión y asignación de casos a las partes responsables respectivas.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Aprobación y Rechazo:</strong>
                                <ul>
                                    <li>Profesores y jefes de comisión pueden revisar casos asignados, tomar decisiones informadas y aprobar o rechazar eficientemente cada solicitud.</li>
                                    <li>Las notificaciones automáticas mantienen a todos los usuarios actualizados sobre el estado de sus casos.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Administración Integral:</strong>
                                <ul>
                                    <li>Las características de administración completa permiten a los usuarios rastrear el estado de cada caso, registrar cambios significativos y mantener un historial detallado de acciones realizadas.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Seguimiento con Comentarios y Archivos:</strong>
                                <ul>
                                    <li>El sistema de comentarios integrado facilita la comunicación entre los involucrados en un caso, permitiendo un intercambio de información claro y documentado.</li>
                                    <li>Se pueden adjuntar archivos relevantes para respaldar la información compartida.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Visualización en Formato de Tabla:</strong>
                                <ul>
                                    <li>Todas las consultas (casos) y coonsultantes se presentan en un formato de tabla claro y organizado, proporcionando una visión general fácilmente comprensible.</li>
                                    <li>Las funciones de filtrado y búsqueda facilitan la ubicación de información específica.</li>
                                </ul>
                            </li>
                        </ol>
                    </p>

                    </Typography>
                    <Button variant="contained" color="secondary" sx={{ width: 'fit-content' }} onClick={handleTutorialOpen}>
                        Comenzar
                    </Button>
                    <TutorialModal open={tutorialOpen} handleClose={handleTutorialClose} />
                    </Box>
            </Dashboard>
        </ThemeProvider>
    );
}

export default HomePage;
