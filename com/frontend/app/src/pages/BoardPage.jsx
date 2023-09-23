import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import Board from '../containers/Board';
import { useParams } from 'react-router-dom';
import getDataBoard, { updatBoardTitle } from '../utils/board';
import Title from '../components/Title';
import { TextField } from '@mui/material';

const titleStyle = {
    style: {
      fontSize: '1.5rem', // Adjust the font size as needed
      color: 'white',    // Text color
    },
}
const theme = createTheme();
export default function BoardPage( ) {
    const { id_board } = useParams();
    const [title, setTitle] = React.useState('Undefine Title');
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedTitle, setEditedTitle] = React.useState(title);

    useEffect(() => {
        const fetchBoardTitle = async () => {
            try {
                const board = await getDataBoard(parseInt(id_board));
                const title_board = board.title;
                setTitle(title_board);
            } catch (error) {
                console.error('Error:', error);
                throw error;
            };
        };
        fetchBoardTitle();
    }, [id_board]);


    const handleDoubleClick = () => {
            setEditedTitle(title);
            setIsEditing(true);
    };

    const handleTitleChange = (event) => {
        setEditedTitle(event.target.value);
    };

    const handleTitleBlur = async () => {
        const newTitle = await updatBoardTitle(id_board, editedTitle);
        if (newTitle !== null && newTitle !== undefined) {
            setTitle(newTitle);
        }
        setIsEditing(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Dashboard title={isEditing ? (
            <TextField
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                autoFocus
                fullWidth
                variant="outlined"
                InputProps={titleStyle}
                />
            ) : (
                <Title onDoubleClick={handleDoubleClick}>{title}</Title>
            )}>
                <Board  id={String(id_board)} />
            </Dashboard>
        </ThemeProvider>
    );
};