import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../components/Copyright';
import TermsAndPoliciesMarkdown from '../components/TermsAndPoliciesMarkdown';
import GavelIcon from '@mui/icons-material/Gavel';


const theme = createTheme();


/**
 * Component representing the Terms and Conditions Page.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function TermsPage() {

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ width: 100, height: 100 , m: 3, bgcolor: 'secondary.main' }}>
            <GavelIcon sx={{ width: 50, height: 50}} />
          </Avatar>
          <Box >
            <TermsAndPoliciesMarkdown/>
        </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};
