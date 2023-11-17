import React, { useState } from 'react';
import Title from '../Title';
import { Box, IconButton, Typography, Popper, Paper, Divider } from '@mui/material';
import { updatPanelTitle } from '../../utils/panel';
import TitleEditable from '../TitleEditable';
import InfoIcon from '@mui/icons-material/Info';


const TitlePanel = ({ panel, isEditable = false }) => {
    const [title, setTitle] = useState(panel.title);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleToggle = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'transitions-popper' : undefined;

    const saveTitle = async (newTitle) => {
        const titleResponse = await updatPanelTitle(panel.id, newTitle);
        if (titleResponse !== null && titleResponse !== undefined) {
            setTitle(titleResponse);
        }
    };

    return (
        <Box style={{ position: 'relative' }}>
            {isEditable ? (
                <TitleEditable title={title} saveTitle={saveTitle} />
            ) : (
                <Title>{title}</Title>
            )}

            {/* IF its a Request board consultancy */}
            {panel.todo_count !== undefined && (<IconButton
                hidden={panel.number_cards !== undefined}
                onClick={handleToggle}
                style={{ position: 'absolute', top: 0, right: 0 }}
            >
                <InfoIcon color='info' />
            </IconButton>)}

            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
            >
                <Paper>
                    <Box p={2}>
                        <Typography variant='h6'>Board Information</Typography>
                        <Typography>{`* ${panel.number_cards} total cards`}</Typography>
                        <Typography>{`* ${panel.todo_count} cards to do`}</Typography>
                        <Typography>{`* ${panel.in_progress_count} cards in progress`}</Typography>
                        <Typography>{`* ${(panel.paused_count + panel.blocked_count) || 0} cards stopped`}</Typography>
                        <Divider sx={{ mb: 3 }} />
                    </Box>
                </Paper>
            </Popper>
        </Box>
    );
};

export default TitlePanel;
