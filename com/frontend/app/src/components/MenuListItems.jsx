import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import InputIcon from '@mui/icons-material/Input';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import  Link  from '@mui/material/Link'
import TuneIcon from '@mui/icons-material/Tune';
import { useUserContext } from '../context/UserContext';
import {fetchBoardsByUser} from '../utils/board';
import { PATH_BOARD, PATH_CONSULTANCY, PATH_CP_CLIENTS, PATH_CP_CONSULT, PATH_LOGOUT } from '../utils/constants';


/**
 * Item with Icon and Text
 **  icon: icon to be displayed
 **  text: text to be displayed
 *  @returns json object
 */
const ListItemIconButton = ( {icon, text} ) => {
  return (
    <ListItemButton>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}


/**
 * Component to List Boards.
 *
 * This component fetches and displays a list of boards associated with the user.
 *
 * @returns {JSX.Element} The ListBoards component JSX.
 */
  const ListBoards = () => {
    const userContext = useUserContext();
    const [boards, setBoards] = useState([]);

    useEffect(() => {
      const fetchBoard = async () => {
        const boardList = await fetchBoardsByUser(userContext.user.pk);
        setBoards(boardList);
      };
      fetchBoard();
    }, [userContext.user.pk]);

  return (
      <ListItemCollapseButton text="Boards" sub_list={boards}/>
  );
};


/**
 * Item with Icon and Text and a Collapse Button
 ** text: text to be displayed
 ** sub_list: list of sub items to be displayed
 *  @returns json object
 */
const ListItemCollapseButton = ({text, sub_list}) => {
  const [open, setOpen] = React.useState(false);
  
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <TableChartIcon/>
      </ListItemIcon>
      <ListItemText primary={text} />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
      {sub_list.map((board, index) => (
        <Link key={index} href={PATH_BOARD + board.id} style={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemIconButton key={index} text={board.title}/>
        </Link>
      ))}
      </List>
    </Collapse>
    </>
  );
};


/**
 * Component for Control Panel List.
 *
 * This component represents a control panel list with collapsible items:
 * - Client Item
 * - Consultations Item
 *
 * @returns {JSX.Element} The ListControlPanel component JSX.
 */
const ListControlPanel = () => {
  const [open, setOpen] = React.useState(false);
  
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <TuneIcon/>
      </ListItemIcon>
      <ListItemText primary={"Control Panel"} />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>

    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <Link key={"link-consult"} href={PATH_CP_CONSULT} style={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemIconButton key={"item-consult"} text={"Consultations"}/>
        </Link>
        <Link key={"link-client"} href={PATH_CP_CLIENTS} style={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemIconButton key={"item-client"} text={"Clients"}/>
        </Link>
      </List>
    </Collapse>
    </>
  );
};


/**
 * Component to display all the  menu items
 * @returns json object with all the menu items
*/
const MenuListItems = ()=>{
  
  return (
  <List component="nav">
    <React.Fragment>
      <Link href="/#" style={{ color: 'inherit', textDecoration: 'none' }}>
        <ListItemIconButton icon={<SettingsIcon />} text="Settings" />
      </Link>
      <Link href={PATH_CONSULTANCY} style={{ color: 'inherit', textDecoration: 'none' }}>
        <ListItemIconButton icon={<InputIcon />} text="Consultancy" />
      </Link>
      <ListControlPanel />
      <Link href={PATH_LOGOUT} style={{ color: 'inherit', textDecoration: 'none' }}>
        <ListItemIconButton icon={<PowerSettingsNewIcon />} text="Logout"/>
      </Link>
      <ListBoards />
    </React.Fragment>
  </List>
  );
};

  export default MenuListItems;
