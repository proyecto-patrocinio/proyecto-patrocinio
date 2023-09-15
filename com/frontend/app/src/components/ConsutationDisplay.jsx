import React from 'react';
import {useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Button} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {formatTimestamp} from '../utils/format.jsx';
import {getConsultation} from '../utils/caseTaker.jsx';
import ClientTable from './ClientTable.jsx';


/**
 * Functional component for displaying consultation details in a dialog.
 * 
 * @param {Object} consultation - The consultation data to display.
 * @param {boolean} open - Boolean indicating whether the dialog is open.
 * @param {Function} onClose - Function to close the dialog.
 * @returns {JSX.Element} - The ConsultationDisplay component JSX.
 */
const ConsutationDisplay = ({consultation, open, onClose }) => {
    const [consultationData, setConsultation] = useState(consultation)

    /**
     * Fetch consultation data if client data is not available.
     */
	useEffect(() => {
		const fetchConsultancy = async () => {
            try {
                if (!consultation.client) {
                    const consultationResponse = await getConsultation(consultation.consultation)
                    setConsultation(consultationResponse)
                }
            } catch (error) {
                console.error("Failed to fetch Consultation in Card.");
                console.debug(error);
            }
        };

        fetchConsultancy();

    }, [consultation]);

    /**
     * Close the dialog.
     */
    const handleClose = () => {
        onClose();
    };


    return (
        <Dialog open={open} onClose={handleClose} >
        <DialogTitle variant="h5">Consultation Details</DialogTitle>
        <DialogContent>



        <div elevation={3} style={{ padding: '20px' }}>

        <TableContainer style={{width: '800px'}}>
            <Table>
            <TableBody>
                <TableRow>
                <TableCell>Tag:</TableCell>
                <TableCell>{consultationData.tag}</TableCell>
                </TableRow>
                <ClientTable clientID={consultationData.client}/>
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
            </TableBody>
            </Table>
        </TableContainer>
        </div>


        </DialogContent>
        <Button onClick={handleClose} color="primary">
            Close
        </Button>
        </Dialog>
    );
};

export default ConsutationDisplay;
