import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider} from "@mui/material";

import App from './App.tsx'

import { PostHogProvider} from 'posthog-js/react'

const options = {
  api_host: import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
}

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

};



createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <PostHogProvider 
      apiKey={import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY}
      options={options}
      
    >
    <BrowserRouter>
    <ThemeProvider theme={theme}> 
      <App />
      </ThemeProvider>
    </BrowserRouter>
    </PostHogProvider>

  </StrictMode>,
)
