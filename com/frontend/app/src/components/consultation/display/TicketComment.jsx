import React, { useEffect } from 'react';
import { useState} from 'react';
import {Card, CardContent, Typography, Avatar, Box, Grid, MenuItem, TextField, IconButton} from '@mui/material';
import TicketMenu from '../../ticket/TicketMenu.jsx';
import { deleteComment } from '../../../utils/comments.jsx';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



/**
 * Comment component for a consultation.
 * @param {Object} comment - Dict with data of the comment.
 */
const TicketComment = ({comment}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(comment.text);

    if(isDeleted){
        return null;
    };

    const handleTitleChange = (event) => {
        setEditedTitle(event.target.value);
    };

    const handleSaveComment = async (event) => {
        const newTitle = event.target.value;
        //saveTitle(newTitle);
        setIsEditing(false);
    };

    const handleCancelComment = async (event) => {
        const newTitle = event.target.value;
        //saveTitle(newTitle);
        setIsEditing(false);
    };

    const handleDeleteComment = async () => {
        await deleteComment(comment.id);
        setIsDeleted(true);
    };

    const handleEditComment = () => {
        // setEditedTitle(comment.text);//TODO: esto se setea como un estado y en effect se pone el comment.text.
        setIsEditing(true);
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
                        <CardContent sx={{ whiteSpace: 'pre-line' }} >
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
                                <Grid item  width="100%">
                                    {isEditing === true ? (
                                        <div>

                                        <TextField
                                            placeholder="Placeholder"
                                            multiline
                                            variant="outlined"
                                            fullWidth
                                            value={editedTitle}
                                            onChange={handleTitleChange}
                                            // onBlur={handleTitleBlur}
                                            autoFocus
                                        />
                                        <div  style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                    <IconButton color="primary" aria-label="menu-ticket" onClick={handleCancelComment}>
                                        <CancelIcon/>
                                    </IconButton>
                                    <IconButton color="primary" aria-label="menu-ticket" onClick={handleSaveComment}>
                                        <CheckCircleIcon/>
                                    </IconButton>
                                        </div>
                                        </div>
                                        ) : (
                                    <Typography>
                                        {comment.text}
                                    </Typography>
                                        )}
                                </Grid>
                            </Grid>
                        </CardContent>
                        {menuComponent}
                    </Card>
                </Box>
    );
};

export default TicketComment;
