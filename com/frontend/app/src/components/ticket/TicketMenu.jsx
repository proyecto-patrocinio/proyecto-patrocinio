import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

/**
 * TicketMenu is a component that displays a menu icon, and when clicked, it opens a menu anchored to the top right corner.
 *
 * @param {boolean} showMenu - A boolean indicating whether the menu should be visible or hidden.
 * @param {ReactNode} children - The content to be displayed inside the menu.
 * @returns {JSX.Element} - The JSX element representing the TicketMenu.
 */
const TicketMenu = ({showMenu, children}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    return (
        <div
            style={{
            position: 'absolute',
            top: 0,
            right: 0,
            visibility: showMenu ? 'visible' : 'hidden',
            }}
        >
            <IconButton aria-label="menu-ticket" onClick={handleMenuClick}>
            <MoreHorizIcon/>
            </IconButton>
            <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            >
            {children}
            </Menu>
        </div>
    )
};

export default TicketMenu;
