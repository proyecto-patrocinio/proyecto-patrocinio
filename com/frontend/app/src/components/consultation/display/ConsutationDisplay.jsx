import React from 'react';
import {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, Button, BottomNavigation, BottomNavigationAction} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CommentIcon from '@mui/icons-material/Comment';
import Comment from './CommentView.jsx';
import ConsutationInfoView from './ConsultationInfoView.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarView from './CalendarView.jsx';


/**
 * Functional component for displaying consultation details in a dialog.
 * 
 * @param {Object} consultation - The consultation data to display.
 * @param {boolean} open - Boolean indicating whether the dialog is open.
 * @param {Function} onClose - Function to close the dialog.
 * @param {Function} updateViewTag - Function to update the view tag in CardView.
 * @returns {JSX.Element} - The ConsultationDisplay component JSX.
 */
const ConsutationDisplay = ({consultation, open, onClose, updateViewTag }) => {
    const [windowNumber, setWindowNumber] = useState(0);

    /**
     * Close the dialog.
     */
    const handleClose = () => {
        onClose();
    };


    return (
        <Dialog fullWidth={true} maxWidth={'md'} open={open} onClose={handleClose} >
        <DialogTitle variant="h5" sx={{ textAlign: 'center' }}>
            Consultation Details
        </DialogTitle>
        <BottomNavigation
            sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
                padding: '10px',
            }}
            showLabels
            value={windowNumber}
            onChange={(event, newValue) => {
                setWindowNumber(newValue);
            }}
        >
            <BottomNavigationAction label="Info" icon={<InfoIcon />} />
            <BottomNavigationAction label="Comments" icon={<CommentIcon />} />
            <BottomNavigationAction label="Calendar" icon={<CalendarMonthIcon />} />
        </BottomNavigation>


        <DialogContent>
        {(windowNumber===0)&&<ConsutationInfoView consultation={consultation} updateViewTag={updateViewTag}/>}
        {(windowNumber===1)&& <Comment consultationID={consultation.consultation}/>}
        {(windowNumber===2)&& <CalendarView cardID={consultation.consultation}/>}  {/* cardID oneToOne Consultation( primarykey ) */}
        </DialogContent>
        <Button onClick={handleClose} color="primary">
            Close
        </Button>
        </Dialog>
    );
};

export default ConsutationDisplay;
