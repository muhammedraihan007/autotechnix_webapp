import { createTheme } from '@mui/material/styles';

// Create a dark theme instance to be shared across the application
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // A light blue, good for accents on a dark background
    },
    background: {
      paper: 'rgba(255, 255, 255, 0.08)', // A very subtle white for paper elements
      default: '#121212', // The default background color
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5', // A lighter grey for secondary text
    }
  },
  components: {
    // Style overrides for specific components
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px', // More rounded corners
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          fontWeight: 'bold',
        }
      }
    }
  },
});
