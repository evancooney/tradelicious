import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider} from "@mui/material";

import App from './App.tsx'

const theme = createTheme();


theme.typography.h1 = {
  fontFamily: 'Raleway, Arial',
  fontSize: '2.5rem' ,
  '@media (min-width:600px)': {
    fontSize: '5rem',
    
  },
 
};

theme.typography.h2 = {

  fontFamily: 'Raleway, Arial',
  typography: {
    fontFamily: 'Raleway, Arial',
  },
  
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  // [theme.breakpoints.up('md')]: {
  //   fontSize: '2.4rem',
  // },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={theme}> 
      <App />
      </ThemeProvider>
    </BrowserRouter>

  </StrictMode>,
)
