import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import Board from '../containers/Board';
import { useParams } from 'react-router-dom';
import getDataBoard, { updateBoardTitle } from '../utils/board';
import TitleEditable from '../components/TitleEditable';


const theme = createTheme();


/**
 * BoardPage is a React component representing a page displaying the content of a specific board.
 *
 * @returns {JSX.Element} - A JSX element representing the board page.
 */
export default function BoardPage( ) {
    const { id_board } = useParams();
    const [title, setTitle] = React.useState('Undefine Title');

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

    const saveTitle = async (newTitle) => {
        const responseTitle = await updateBoardTitle(id_board, newTitle);
        if (responseTitle !== null && responseTitle !== undefined) {
            setTitle(responseTitle);
        }
    };
    const titleComponent = TitleEditable({title, saveTitle});

    return (
        <ThemeProvider theme={theme}>
            <Dashboard title={titleComponent}>
                <Board  id={String(id_board)} />
            </Dashboard>
        </ThemeProvider>
    );
};
