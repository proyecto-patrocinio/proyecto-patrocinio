import React from 'react';
import {useEffect, useState} from 'react';
import {TextField,Box} from '@mui/material';
import {createComment, getCommentListByConsult} from '../../../utils/comments.jsx';
import {useUserContext} from '../../../context/UserContext.jsx';
import TicketComment from './TicketComment.jsx';
import AddButton from '../../AddButton.jsx';



/**
 * Comment component for a consultation.
 * @param {Number} consultationID - ID of the consultation to which the comments belong.
 */
const Comment = ({consultationID}) => {
    const userContext =  useUserContext();
    const [userData, setUserData] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

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

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            const commentData = {user: userData.pk, consultation: consultationID, text: newComment};
            const commentDict = await createComment(commentData);
            commentDict.user = userData
            setComments([commentDict, ...comments]);
            setNewComment('');
        }
    };

    return (
        <div>
            {/* Input Text for new Comment */}
            <Box width="100%" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <TextField
                    id="outlined-textarea"
                    placeholder="Placeholder"
                    label="Add a comment"
                    multiline
                    variant="outlined"
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <AddButton onClick={handleAddComment}/>
            </Box>
            {/*List of Comments */}
            {comments.map((comment, index) => (<TicketComment comment={comment}/>))}
        </div>
    );
};

export default Comment;
