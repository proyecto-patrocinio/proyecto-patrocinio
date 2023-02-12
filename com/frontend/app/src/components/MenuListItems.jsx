import React from 'react';
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
 * Item with Icon and Text and a Collapse Button
 ** text: text to be displayed
 ** sub_list: list of sub items to be displayed
 *  @returns json object 
 */
const ListItemCollapseButton = ( {text,sub_list} ) => {


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
     { sub_list.map((item, index) => (
          <ListItemIconButton  key={index} text={item}/>
        ))
      }
      </List>
    </Collapse>
    </>
  );
};


/**
 * Component to display all the menu items
 * @returns json object with all the menu items
 */
 const MenuListItems = ()=>{
  return (

  <List component="nav">
   <React.Fragment>
    <ListItemIconButton icon={<SettingsIcon />} text="Settings" />
    <ListItemCollapseButton text="Dashboards" sub_list={["Board1","Board2"]}/>
    <ListItemIconButton icon={<InputIcon />} text="Case Taker" />
    <ListItemIconButton icon={<TuneIcon />} text="Control Panel" />
    <ListItemIconButton icon={<PowerSettingsNewIcon />} text="Sign Out" />
  </React.Fragment>
  </List>
  );
  }

  export default MenuListItems;