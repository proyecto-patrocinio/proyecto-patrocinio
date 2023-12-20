import React from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const InputFileUpload = ({file, setFile }) => {

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    setFile(null);
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput">
        <Button
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          {file ? (
            <>
            {file.name}{' '}
            <Button onClick={handleCancel} color="error">
              X
            </Button>
            </>
          ) : (
            'Upload file'
          )}
        </Button>
      </label>
      
    </div>
  );
};

export default InputFileUpload;
