import React, { useState } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile } from '../utils/comments';

const InputFileUpload = ({ commentID }) => {
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      console.log(e.target.files)
      setFile(e.target.files[0]);
    }
  };


  const handleUploadClick = async () => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('uploadedFile', file);
    formData.append('filename', file.name);
    formData.append('comment', 30);
  
    uploadFile(formData)

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
          Upload file
        </Button>
      </label>
      <Button onClick={handleUploadClick}>OK</Button>
    </div>
  );
};

export default InputFileUpload;
