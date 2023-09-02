import React, { useContext, useEffect, useState } from 'react';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import TuneIcon from '@mui/icons-material/Tune';
import InputIcon from '@mui/icons-material/Input';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import  Link  from '@mui/material/Link'
import { useUserContext } from '../context/UserContext';
import getDataBoard from './utils/board';


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


  const ListBoards = ( ) => {
    const userContext = useUserContext();
    const [boards, setBoards] = useState([]);
    useEffect(() => {
      const fetchBoard = async () => {
        try {
          const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_USERBOARD_BY_USER
            + userContext.user.pk;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            const boardPromises = data.map((item) => getDataBoard(item.board));
            const boards = await Promise.all(boardPromises);
            setBoards(boards);
          } else {
            console.error('Failed to fetch board-user:', response.status);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
      
       fetchBoard();
    }, [userContext.user.pk]);

  return (
      <ListItemCollapseButton text="Boards" sub_list={boards}/>
  );
}
/**
 * Item with Icon and Text and a Collapse Button
 ** text: text to be displayed
 ** sub_list: list of sub items to be displayed
 *  @returns json object 
 */
const ListItemCollapseButton = ( {text, sub_list} ) => {


  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
    <ListItemButton>
     <ListItemIcon>
      <TableChartIcon  />
    </ListItemIcon>
    <ListItemText primary={text} onClick={handleClick} />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
     { sub_list.map((board, index) => (
    <Link key={index} href={"/board/" + board.id} style={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemIconButton  key={index} text={board.title}/>
    </Link>
        ))
      }
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
   <Link href="/# " style={{ color: 'inherit', textDecoration: 'none' }}>
      <ListItemIconButton icon={<SettingsIcon />} text="Settings" />
    </Link>
    <Link href="/case-taker" style={{ color: 'inherit', textDecoration: 'none' }}>
      <ListItemIconButton icon={<InputIcon />} text="Case Taker" />
    </Link>
    <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
      <ListItemIconButton icon={<TuneIcon />} text="Control Panel" />
    </Link>
    <Link href="/logout" style={{ color: 'inherit', textDecoration: 'none' }}>
      <ListItemIconButton icon={<PowerSettingsNewIcon />} text="Logout"/>
    </Link>
    <ListBoards />
  </React.Fragment>
  </List>
  );
  }

  export default MenuListItems;