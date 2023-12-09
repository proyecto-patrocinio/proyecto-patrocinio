
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
      is licensed under{' '}
      <Link
        href="http://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"
        target="_blank"
        rel="license noopener noreferrer"
        style={{ display: 'inline-block' }}
      >
        CC BY-SA 4.0
        <img
          style={{ height: '20px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
          src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
          alt="CC"
        />
        <img
          style={{ height: '20px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
          src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
          alt="BY"
        />
        <img
          style={{ height: '20px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
          src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
          alt="SA"
        />
      </Link>
    </Typography>
  );
};

  export default Copyright;