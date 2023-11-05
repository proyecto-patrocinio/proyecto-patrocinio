import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, List, ListItem, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { getRandomNumber } from '../utils/tools';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';


function PhoneNumbersDialog({ open, onClose, phoneNumbers, onAdd, onDelete }) {
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const handleAdd = (event) => {
    if (newPhoneNumber.trim() !== '') {
      const newPhoneDict = {id: getRandomNumber(999), phone_number:newPhoneNumber}
      onAdd(newPhoneDict);
    }
    setNewPhoneNumber(event.target.value);
  };

  const handleDelete = (index) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    const deletedPhone = updatedPhoneNumbers.splice(index, 1);
    if(!!deletedPhone) {
      onDelete(deletedPhone[0]);
    }
  };

  const handleClose = () => {
    setNewPhoneNumber('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <List>
          {phoneNumbers.map((phoneDict, index) => (
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
          <Button onClick={handleAdd} color="primary" startIcon={<AddIcCallIcon />} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} startIcon={<CloseIcon />} />
      </DialogActions>
    </Dialog>
  );
}

export default PhoneNumbersDialog;
