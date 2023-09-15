import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dashboard from '../containers/Dashboard';
import Board from '../containers/Board';
import { useParams } from 'react-router-dom';
import getDataBoard from '../utils/board';

const theme = createTheme();
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

    return (
        <ThemeProvider theme={theme}>
            <Dashboard title={title}>
                <Board  id={String(id_board)} />
            </Dashboard>
        </ThemeProvider>
    );
};