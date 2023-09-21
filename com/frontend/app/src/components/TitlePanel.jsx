import React, { useState } from 'react';
import Title from '../components/Title';
import { Badge, Tooltip, Box } from '@mui/material';
import TextField from '@mui/material/TextField';

const titleStyle = {
    style: {
      fontSize: '1.5rem', // Adjust the font size as needed
      color: 'white',    // Text color
    },
}


/**
 * TitlePanel component displays the title of a panel and a badge with the number of cards it contains.
 *
 * @param {Object} panel - The panel object containing information about the panel, including title and number of cards.
 * @param {boolean} isEditable - Whether the panel title is editable or not.
 * @returns {JSX.Element} - A React element representing the TitlePanel.
 */
const TitlePanel = ({panel, isEditable=false}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(panel.title);

    const handleDoubleClick = () => {
        if (isEditable) {
            setIsEditing(true);
        }
    };

    const handleTitleChange = (event) => {
        setEditedTitle(event.target.value);
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
        //TODO: Update in the backend
    };

    return (
        <Box style={{ position: 'relative' }}>
            {isEditing ? (
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
                <Title onDoubleClick={handleDoubleClick}>{editedTitle}</Title>
            )}
            <Tooltip title={`Contains ${panel.number_cards} tickets`}>
            {/*Badge with number of cards in the panel*/}
            <Badge
                key={"badge-" + String(panel.id)}
                color="info"
                badgeContent={panel.number_cards !== 0 ? panel.number_cards : "0"}
                style={{ position: 'absolute', top: 0, right: 0 }} />
            </Tooltip>
        </Box>
    );
};

export default TitlePanel;
