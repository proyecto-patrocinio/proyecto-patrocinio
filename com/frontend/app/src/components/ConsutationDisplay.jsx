import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {formatTimestamp} from './utils/format.jsx';


const ConsutationDisplay = ({ consultation, open, onClose }) => {

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h5">Consultation Details</DialogTitle>
        <DialogContent>



        <div elevation={3} style={{ padding: '20px' }}>

        <TableContainer>
            <Table>
            <TableBody>
                <TableRow>
                <TableCell>Tag:</TableCell>
                <TableCell>{consultation.tag}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Client:</TableCell>
                <TableCell>{consultation.client}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Opponent:</TableCell>
                <TableCell>{consultation.opponent}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>State:</TableCell>
                <TableCell>{consultation.state}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Description:</TableCell>
                <TableCell>{consultation.description}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Creation time stamp:</TableCell>
                <TableCell>{formatTimestamp(consultation.time_stamp)}</TableCell>
                </TableRow>
                {/* Agrega más filas de tabla según los datos de tu consulta */}
            </TableBody>
            </Table>
        </TableContainer>
        </div>


        </DialogContent>
        <Button onClick={handleClose} color="primary">
            Cerrar
        </Button>
        </Dialog>
    );
};

export default ConsutationDisplay;
