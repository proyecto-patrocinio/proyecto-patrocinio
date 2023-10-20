import React from 'react';
import { useState} from 'react';
import {Card, CardContent, Typography, Avatar, Box, Grid, MenuItem} from '@mui/material';
import TicketMenu from '../../ticket/TicketMenu.jsx';
import { deleteComment } from '../../../utils/comments.jsx';



/**
 * Comment component for a consultation.
 * @param {Object} comment - Dict with data of the comment.
 */
const TicketComment = ({comment}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [idDeleted, setDeleted] = useState(false);

    if(idDeleted){
        return null;
    };

    const handleDeleteComment = async () => {
        await deleteComment(comment.id);
        setDeleted(true);
    };

    const handleEditComment = () => {
        console.log("Deleting"); //TODO
    };

    const menuComponent = (
        <div
            style={{
                position: 'absolute',
                top: '0',
                right: '0',
            }}
            >
            <TicketMenu showMenu={showMenu} key={"menu"}>
                <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
                <MenuItem onClick={handleEditComment}>Edit</MenuItem>
            </TicketMenu>
        </div>
    );

    return (
                <Box
                    key={comment.id} width="100%" style={{ marginBottom: '10px' }}
                    onMouseEnter={()=> setShowMenu(true)}
                    onMouseLeave={()=> setShowMenu(false)}
                >
                    <Card key={comment.id} variant="outlined" style={{ marginBottom: '10px' , position: 'relative'}}>
                        <CardContent sx={{ whiteSpace: 'pre-line' }}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        {comment.user.username?.charAt(0)}
                                    </Avatar>
                                    </Grid>
                                    <Grid item>
                                    <Typography variant="h6" component="div">
                                        {comment.user.username}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>
                                        {comment.text}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                        {menuComponent}
                    </Card>
                </Box>
    );
};

export default TicketComment;
