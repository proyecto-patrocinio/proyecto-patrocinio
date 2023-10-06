import React, { useState } from 'react';
import Title from '../components/Title';
import { Badge, Tooltip, Box } from '@mui/material';
import { updatPanelTitle } from '../utils/panel';
import TitleEditable from './TitleEditable';

/**
 * TitlePanel component displays the title of a panel and a badge with the number of cards it contains.
 *
 * @param {Object} panel - The panel object containing information about the panel, including title and number of cards.
 * @param {boolean} isEditable - Whether the panel title is editable or not.
 * @returns {JSX.Element} - A React element representing the TitlePanel.
 */
const TitlePanel = ({panel, isEditable=false}) => {
    const [title, setTitle] = useState(panel.title);


    const saveTitle = async (newTitle) => {
        const titleResponse = await updatPanelTitle(panel.id, newTitle);
        if (titleResponse !== null && titleResponse !== undefined) {
            setTitle(titleResponse);
        }
    };

    return (
        <Box style={{ position: 'relative' }}>
            {isEditable? 
                (<TitleEditable title={title} saveTitle={saveTitle}/>):
                ( <Title> {title}</Title>)
            }
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
