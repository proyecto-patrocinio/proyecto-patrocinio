import * as React from 'react';
import Typography from '@mui/material/Typography';

function Title(props) {
  const handleDoubleClick = () => {
    if (props.onDoubleClick) {
      props.onDoubleClick();
    }
  };

  return (
    <Typography
      component='h2'
      variant="h5"
      color="white"
      gutterBottom
      onDoubleClick={handleDoubleClick}
    >
      {props.children}
    </Typography>
  );
}

export default Title;
