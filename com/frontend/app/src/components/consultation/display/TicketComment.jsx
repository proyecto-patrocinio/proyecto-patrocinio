import React, { useEffect } from 'react';
import { useState} from 'react';
import {Card, CardContent, Typography, Avatar, Box, Grid, MenuItem, TextField, IconButton, Link} from '@mui/material';
import TicketMenu from '../../ticket/TicketMenu.jsx';
import { deleteComment, getURLtoDownloadFile, updateComment } from '../../../utils/comments.jsx';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AlertSnackbar from '../../AlertSnackbar.jsx';
import AttachFileIcon from '@mui/icons-material/AttachFile';


/**
 * Comment component for a consultation.
 * @param {Object} comment - Dict with data of the comment.
 */
const TicketComment = ({comment}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCommentContent, setEditedCommentContent] = useState(comment?.text);
    const [commentDict, setCommentDict] = useState(comment);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(()=>{
        setCommentDict(comment)
    },[comment])

    if(isDeleted){
        return null;
    };

    const handleCommentDataChange = (event) => {
        setEditedCommentContent(event.target.value);
    };

    const handleConfirmEdition = async () => {
        const newComment = commentDict;
        newComment.text = editedCommentContent;
        try {
            await updateComment(newComment.id, {text: editedCommentContent});
        } catch (e) {
            setAlertMessage(e.message);
            return;
        }
            setCommentDict(newComment);
        setIsEditing(false);
    };

    const handleCancelateEdition = async (event) => {
        setIsEditing(false);
    };

    const handleDeleteClick = async () => {
        try {
            await deleteComment(commentDict?.id);
        } catch (e) {
            setAlertMessage(e.message);
            return;
        }
        setIsDeleted(true);
    };

    const handleEditClick = () => {
        setEditedCommentContent(commentDict?.text);
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
                <MenuItem id="comment-menu-item-delete" onClick={handleDeleteClick}>Eliminar</MenuItem>
                <MenuItem id="comment-menu-item-edit" onClick={handleEditClick}>Editar</MenuItem>
            </TicketMenu>
        </div>
    );

    const LinkFileComponente = ({file}) => {
        const downloadURL = getURLtoDownloadFile(file?.id);
        return (
            <div>
                <AttachFileIcon/>
                <Link
                href={downloadURL}
                style={{ cursor: 'pointer' }}
                >
                {file?.filename}
                </Link>
            </div>
    )
    };

    return (
                <Box
                    key={commentDict?.id} width="100%" style={{ marginBottom: '10px' }}
                    onMouseEnter={()=> setShowMenu(true)}
                    onMouseLeave={()=> setShowMenu(false)}
                >
                    <Card key={commentDict?.id} variant="outlined" style={{ marginBottom: '10px' , position: 'relative'}}>
                        <CardContent sx={{ whiteSpace: 'pre-line' }} >
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        {commentDict?.user?.username?.charAt(0)}
                                    </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" component="div">
                                            {commentDict?.user?.username}
                                        </Typography>
                                </Grid>
                                <Grid item  width="100%">
                                    {isEditing === true ? (
                                        <div>
                                            <TextField
                                                id="edit-comment-area"
                                                placeholder="Ingrese su comentario aquí..."
                                                multiline
                                                variant="outlined"
                                                fullWidth
                                                value={editedCommentContent}
                                                onChange={handleCommentDataChange}
                                                autoFocus
                                            />
                                            <div  style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <IconButton id="comment-edit-cancel-button" color="primary" aria-label="menu-ticket" onClick={handleCancelateEdition}>
                                                    <CancelIcon/>
                                                </IconButton>
                                                <IconButton id="comment-edit-confim-button" color="primary" aria-label="menu-ticket" onClick={handleConfirmEdition}>
                                                    <CheckCircleIcon/>
                                                </IconButton>
                                            </div>
                                        </div>
                                        ) : (
                                    <Typography>
                                        {commentDict?.text}
                                    </Typography>
                                        )}
                                        {   commentDict?.files  && commentDict.files.map((file, index) => (
                                            <LinkFileComponente key={index} file={file}/>
                                        ))}
                                </Grid>
                            </Grid>
                        </CardContent>
                        {menuComponent}
                    </Card>
                    <AlertSnackbar onClose={() => {setAlertMessage("")}} message={alertMessage} severity={'error'}/>
                </Box>
    );
};

export default TicketComment;
