import React, { useState } from 'react';
import Title from '../Title';
import {Box} from '@mui/material';
import { updatPanelTitle } from '../../utils/panel';
import TitleEditable from '../TitleEditable';
import BoardInfo from '../BoardInfo';


/**TitlePanel Component
 *
 * Displays the title of a panel and provides the option to edit it if specified.
 * If the panel represents a request board consultancy, additional information is shown.
 *
 * @component
 * @param {Object} props - The properties of the component.
 * @param {Object} props.panel - The panel object containing title and additional information.
 * @param {boolean} [props.isEditable=false] - Indicates whether the title is editable.
 * @returns {React.Element} The rendered TitlePanel component.
 */
const TitlePanel = ({ panel, isEditable = false }) => {
    const [title, setTitle] = useState(panel.title);
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

            {/* IF it's a Request board consultancy */}
            {panel.todo_count !== undefined && (
                <BoardInfo panel={panel} />
            )}

        </Box>
    );
};

export default TitlePanel;
