/**************************************************************************
 * In this Card component: We're using react-beautiful-dnd's Draggable    *
 * component to make the card draggable. We are also passing              *
 * the properties "draggableId " and "index" to a "Draggable".            *
 **************************************************************************/
import React from 'react';
import {useState} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ConsutationDisplay from '../consultation/display/ConsutationDisplay.jsx'


/**
 * BaseTicket Component: Represents a draggable ticket with customizable content.
 *
 * @param {Object} props - The component's properties.
 * @param {Object} props.ticket - Data of the ticket to display.
 * @param {number} props.index - The index of the ticket in the list.
 * @param {Object} props.cardContentProps - Additional properties for the ticket's content. Default is {}.
 * @param {ReactNode} props.children - Child components to render within the ticket.
 * @returns {JSX.Element} - A draggable ticket with customizable content.
 */
const BaseTicket = ({ticket, index, cardContentProps={}, children}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [tag, setTag] = useState(ticket.tag);

    if (ticket == null || ticket.length === 0) {
        return <div>No Tickets.</div>;
    }

    const showConsultationHandler = () => {
        setOpenDialog(true)
    }

    const closeConsultationHandler = () => {
        setOpenDialog(false)
    }

    return (
        <Draggable draggableId={String(ticket.consultation)} index={index}>
        {(provided) => (
            <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            >
            <Card style={{width: '15vw', margin: '0 auto', position: 'relative', minWidth: '150px'}} onDoubleClick={showConsultationHandler}>
                <CardContent {...cardContentProps}>
                    {children}
                    <Typography color="textSecondary" gutterBottom>
                    {tag}
                    </Typography>
                </CardContent>
            </Card>
            <ConsutationDisplay consultation={ticket} open={openDialog} onClose={closeConsultationHandler} updateViewTag={setTag}/>
            </div>
        )}
        </Draggable>
    );
};

export default BaseTicket;
