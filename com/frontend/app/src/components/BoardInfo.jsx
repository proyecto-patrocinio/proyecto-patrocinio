import React, { useEffect, useState } from 'react';
import {
    Box, IconButton, Typography, Popper, Paper, Divider, Dialog,
    DialogTitle, DialogContent, DialogActions, Button, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { getBoardLogs } from '../utils/caseTaker';


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
            const response = await getBoardLogs(10, panel.id);
            console.log(response)
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
                        <Typography variant='h6'>Board Information</Typography>
                        <Typography>{`* ${panel.number_cards} total cards`}</Typography>
                        <Typography>{`* ${panel.todo_count} cards to do`}</Typography>
                        <Typography>{`* ${panel.in_progress_count} cards in progress`}</Typography>
                        <Typography>{`* ${(panel.paused_count + panel.blocked_count) || 0} cards stopped`}</Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant='h6'>Board Logs</Typography>
                        {logs.slice(0, 5).map( (log)=> <Typography>{`* ${log.start_time.split('T')[0]} | ${log.tag}`}</Typography> )}
                    </Box>
                    {
                        logs.length > 5 ? (
                        <Button onClick={handleDialogOpen}>
                            Show More
                        </Button>
                    ): ""}
                </Paper>
            </Popper>



            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>History of Accepted Consultations</DialogTitle>
                <DialogContent>

                <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Consultation ID</TableCell>
                        <TableCell>Response Time (Accepted)</TableCell>
                        <TableCell>Tag</TableCell>
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
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

    </>
    );
};

export default BoardInfo;
