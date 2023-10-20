import React from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


/**
 * Component that displays a button for uploading files.
 * @returns {JSX.Element} JSX element representing the file upload button.
 */
const InputFileUpload = () => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      //TODO:
      console.log('Archivo seleccionado:', file.name);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <label htmlFor="fileInput">
        <Button
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
        </Button>
      </label>
    </div>
  );
};

export default InputFileUpload;
