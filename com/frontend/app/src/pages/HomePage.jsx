import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import { Typography } from '@mui/material';

const theme = createTheme();
export default function HomePage( ) {

    return (
        <ThemeProvider theme={theme}>
            <Dashboard>
                <Typography variant="h4" gutterBottom>
                    Bienvenido a la aplicación de seguimiento de casos
                </Typography>
                <Typography variant="body1" gutterBottom>
                La aplicación de gestión de casos para el proyecto de patrocinio jurídico de la UBA 
                es una plataforma que permite a los abogados y estudiantes de derecho administrar los 
                casos legales asignados a ellos de manera más eficiente. La aplicación incluye características 
                como gestión de casos, asignación de casos, comunicación, calendario, documentación y estadísticas.
                Estas características permiten a los usuarios almacenar y acceder a información relevante, 
                programar citas y audiencias, comunicarse otros miembros del equipo, generar 
                informes y estadísticas para evaluar el desempeño del equipo y tomar decisiones basadas en datos. 
                En resumen, la aplicación de gestión de casos mejora la eficiencia y efectividad del proyecto de patrocinio
                jurídico de la UBA, lo que permite brindar un mejor servicio a los clientes y obtener mejores resultados en los tribunales.
                </Typography>
            </Dashboard>
        </ThemeProvider>
    );
};