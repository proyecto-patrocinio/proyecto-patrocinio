import { Box, TextField } from "@mui/material";
import { useState } from "react";
import Title from "./Title";


const titleStyle = {
    style: {
      fontSize: '1.5rem', // Adjust the font size as needed
      color: 'white',    // Text color
    },
}


/**
 * TitleEditable is a React component that allows for editing a title in a user-friendly manner.
 * It provides an input field for editing when double-clicked and displays the title when not in edit mode.
 *
 * @param {string} title - The current title to display and edit.
 * @param {function} saveTitle - A callback function to handle when the title input field loses focus.
 *
 * @returns {JSX.Element} - A JSX element representing the editable title component.
 */
const TitleEditable = ({title, saveTitle}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    const handleDoubleClick = () => {
        setEditedTitle(title);
        setIsEditing(true);
    };

    const handleTitleChange = (event) => {
        setEditedTitle(event.target.value);
    };

    const handleTitleBlur = async (event) => {
        const newTitle = event.target.value;
        saveTitle(newTitle);
        setIsEditing(false);
    };

    return (
        <Box>
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
                <Title onDoubleClick={handleDoubleClick}>{title}</Title>
            )}
        </Box>
    );
};

export default TitleEditable;
