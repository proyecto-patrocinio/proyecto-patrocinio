import React from 'react';
import {useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Button} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {formatTimestamp} from './utils/format.jsx';
import {getConsultation} from './utils/caseTaker.jsx';


const ConsutationDisplay = ({consultation, open, onClose }) => {
    const [consultationData, setConsultation] = useState(consultation)

	useEffect(() => {
		const fetchConsultancy = async () => {
		try {
            if (consultation.client) {
                // Get Client information
                //TODO: get clietn data
            } else { // Don't have Data in Consultation
                // Get Data Consultation from Backend
                const consultationResponse = await getConsultation(consultation.consultation)
                //TODO: get clietn data
                setConsultation(consultationResponse)
            }

		} catch (error) {
            console.error("Failed to fetch Consultation in Card.");
			console.debug(error);
		}
  };
  
  fetchConsultancy();
  }, []);

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
                <TableCell>{consultationData.tag}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Client:</TableCell>
                <TableCell>{consultationData.client}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Opponent:</TableCell>
                <TableCell>{consultationData.opponent}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>State:</TableCell>
                <TableCell>{consultationData.state}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Description:</TableCell>
                <TableCell>{consultationData.description}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Creation time stamp:</TableCell>
                <TableCell>{formatTimestamp(consultationData.time_stamp)}</TableCell>
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
