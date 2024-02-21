
import  Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";


function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
      <Link
        href="https://github.com/proyecto-patrocinio/proyecto-patrocinio"
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
      >
        Case Management System
      </Link>{' '}
      by{' '}
      <Link
        href="https://github.com/prietojulii"
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
      >
        J. Prieto
      </Link>{' '}
      is licensed under MIT ©
    </Typography>
  );
};

  export default Copyright;