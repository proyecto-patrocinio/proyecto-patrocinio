import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, List, ListItem, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { getRandomNumber } from '../utils/tools';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';


/**
 * PhoneNumbersDialog component displays a dialog for managing phone numbers.
 *
 * @param {Object} props - The component's props.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @param {Array} props.phoneNumbers - The list of phone numbers to display.
 * @param {Function} props.onAdd - Callback function to add a new phone number.
 * @param {Function} props.onDelete - Callback function to delete a phone number.
 */
function PhoneNumbersDialog({ open, onClose, phoneNumbers, onAdd, onDelete }) {
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [numbersList, setNumbersList] = useState(phoneNumbers);

  useEffect(()=> {
    setNumbersList(phoneNumbers);
  },[phoneNumbers]);

  const addHandler = (event) => {
    if (newPhoneNumber.trim() !== '') {
      const newPhoneDict = {id: getRandomNumber(Number.MAX_SAFE_INTEGER), phone_number:newPhoneNumber}
      onAdd(newPhoneDict);
      setNumbersList([...numbersList, newPhoneDict]);
    }
    setNewPhoneNumber('');
  };

  const handleDelete = (index) => {
    const updatedPhoneNumbers = [...numbersList];
    const deletedPhoneList = updatedPhoneNumbers.splice(index, 1);
    if(!!deletedPhoneList) {
      const deletedPhone = deletedPhoneList[0];
      setNumbersList(updatedPhoneNumbers);
      onDelete(deletedPhone);
    }
  };

  const closeHandler = () => {
    setNewPhoneNumber('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={closeHandler}>
      <DialogContent>
        <List>
          {numbersList?.map((phoneDict, index) => (
            <ListItem key={index}>
              {phoneDict?.phone_number}
              <IconButton onClick={() => handleDelete(index)} color="secondary">
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Add Phone Number"
            fullWidth
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
          />
          <Button onClick={addHandler} color="primary" startIcon={<AddIcCallIcon />} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler} startIcon={<CloseIcon />} />
      </DialogActions>
    </Dialog>
  );
}

export default PhoneNumbersDialog;
