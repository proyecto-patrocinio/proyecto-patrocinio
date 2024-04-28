import React from 'react';
import {useEffect, useState} from 'react';
import {TextField,Box, Paper} from '@mui/material';
import {createComment, getCommentListByConsult, uploadFile} from '../../../utils/comments.jsx';
import {useUserContext} from '../../../context/UserContext.jsx';
import TicketComment from './TicketComment.jsx';
import AddButton from '../../AddButton.jsx';
import InputFileUpload from '../../UploadFileButton.jsx';



/**
 * Comment component for a consultation.
 * @param {Number} consultationID - ID of the consultation to which the comments belong.
 */
const Comment = ({consultationID}) => {
    const userContext =  useUserContext();
    const [userData, setUserData] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [file, setFile] = useState();

    useEffect(() => {
        const initComment = async() => {
            const coments = await getCommentListByConsult(consultationID);
            setComments(coments);
        };
        initComment();
    }, [consultationID]);

    useEffect(() => {
        setUserData(userContext.user);
    }, [userContext])


    const handleUploadFile = async (commentID) => {
        if (!file) {
            return null;
        }
        const formData = new FormData();
        formData.append('uploadedFile', file);
        formData.append('filename', file.name);
        formData.append('comment', commentID);
        const responseFile = await uploadFile(formData);
        return [responseFile];
    };

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            const commentData = {user: userData.pk, consultation: consultationID, text: newComment};
            const commentDict = await createComment(commentData);
            const attachedFile = await handleUploadFile(commentDict.id);
            commentDict.files = attachedFile;
            commentDict.user = userData
            setComments([commentDict, ...comments]);
            setNewComment('');
            setFile(null);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '16px' }}>
            {/* Menu */}
            <Box display="flex" justifyContent="flex-end" marginBottom="16px">
                <InputFileUpload file={file} setFile={setFile}/>
            </Box>
            {/* Input Text for New Comment */}
            <Box display="flex" alignItems="center" marginBottom="16px">

            <TextField
                id="outlined-textarea"
                placeholder="Add a comment"
                label="Agregar comentario"
                multiline
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <AddButton onClick={handleAddComment}>
                <AddButton />
            </AddButton>
            </Box>

            {/* List of Comments */}
            {comments.map((comment, index) => (
                <TicketComment key={index} comment={comment} />
            ))}
        </Paper>
    );
};

export default Comment;
