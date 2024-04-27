import React, { useEffect, useState } from 'react';
import {
    Box, IconButton, Typography, Popper, Paper, Divider, Dialog,
    DialogTitle, DialogContent, DialogActions, Button, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { getBoardLogs } from '../utils/caseTaker';


const DAYS_FOR_BOARD_LOGS = 10


/**BoardInfo Component
 *
 * Displays information about a board, including cards states and logs.
 *
 * @component
 * @param {Object} props - The properties of the component.
 * @param {Object} props.panel - The panel object containing board information.
 * @returns {React.Element} The rendered BoardInfo component.
 */
const BoardInfo = ({ panel}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const setUpLogs = async () =>{
            const response = await getBoardLogs(DAYS_FOR_BOARD_LOGS, panel.id);
            setLogs(response);
        };
        setUpLogs();
    },[panel.id]);

    const id = anchorEl ? 'transitions-popper' : undefined;

    const handleToggle = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return (
        <>
        <IconButton
            id={'board-info-button-' + panel.id}
            hidden={panel.number_cards !== undefined}
            onClick={handleToggle}
            style={{ position: 'absolute', top: 0, right: 0 }}
        >
            <InfoIcon color='info' />
        </IconButton>


        <Popper
                id={id}
                open={!!anchorEl}
                anchorEl={anchorEl}
                placement="bottom-end"
            >
                <Paper>
                    <Box p={2}>
                        <Typography variant='h6'>Información de Tablero</Typography>
                        <Typography>{`* ${panel.number_cards} consultas totales`}</Typography>
                        <Typography>{`* ${panel.todo_count} consultas por hacer`}</Typography>
                        <Typography>{`* ${panel.in_progress_count} consultas en progreso`}</Typography>
                        <Typography>{`* ${(panel.paused_count + panel.blocked_count) || 0} consultas detenidas`}</Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant='h6'>Logs de Tablero</Typography>
                        {logs.slice(0, 5).map( (log)=> <Typography>{`* ${log.start_time.split('T')[0]} | ${log.tag}`}</Typography> )}
                    </Box>
                    {
                        logs.length > 5 ? (
                        <Button onClick={handleDialogOpen}>
                            Ver Mas
                        </Button>
                    ): ""}
                </Paper>
            </Popper>


            {/* Display for logs */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>Historial de Consultas Aceptadas</DialogTitle>
                <DialogContent>

                <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>ID de consulta</TableCell>
                        <TableCell>Fecha de aceptación</TableCell>
                        <TableCell>Etiqueta</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.tag}>
                        <TableCell>{log.consultation_id}</TableCell>
                        <TableCell>{log.start_time.split('T')[0]}</TableCell>
                        <TableCell>{log.tag}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>

                </DialogContent>
                <DialogActions>

                    <Button onClick={handleDialogClose} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

    </>
    );
};

export default BoardInfo;
