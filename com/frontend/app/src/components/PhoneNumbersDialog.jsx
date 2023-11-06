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
 * @param {Function} props.onUpdatePhoneNumbers - Callback function to add or delete phone number.
 */
function PhoneNumbersDialog({ open, onClose, phoneNumbers, onUpdatePhoneNumbers }) {
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const addHandler = (event) => {
    if (newPhoneNumber.trim() !== '') {
      const newPhoneDict = {id: getRandomNumber(Number.MAX_SAFE_INTEGER), phone_number:newPhoneNumber};
      onUpdatePhoneNumbers([...phoneNumbers, newPhoneDict]);
    }
    setNewPhoneNumber('');
  };

  const handleDelete = (index) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers.splice(index, 1);
    onUpdatePhoneNumbers(updatedPhoneNumbers);
  };

  const closeHandler = () => {
    setNewPhoneNumber('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={closeHandler}>
      <DialogContent>
        <List>
          {phoneNumbers?.map((phoneDict, index) => (
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
