import { useState, KeyboardEvent } from "react";
import { Button, TextField, Box, Typography, List, ListItem, IconButton, useTheme } from "@mui/material";
import SongCollection from './components/SongCollection';

interface ResponseData {
  [key: string]: any;
}

export default function App() {
  const theme = useTheme();
  const [text, setText] = useState<string>("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [results, setResults] = useState<ResponseData[]>([]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/analyze', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data: ResponseData = await res.json();
      setResponse(data);
      setResults((prevResults) => [...prevResults, data]);
      setText("");
    } catch (error) {
      console.error("Error sending request:", error);
      setResponse({ error: "Failed to send request" });
    }
  };

  const handleClearResults = () => {
    setResults([]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "top",  bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Box sx={{ p: 4, maxWidth: 500, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: "8px" }}>
        <Typography variant="h5" gutterBottom>Send a POST Request</Typography>
        <TextField 
          fullWidth 
          variant="outlined" 
          label="Enter text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          onKeyDown={handleKeyDown} 
          sx={{ mb: 2 }}
        />
        https://open.spotify.com/track/1TIiWomS4i0Ikaf9EKdcLn?si=532db46d19704cc1
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Send</Button>
   
        
    
      </Box>
    
        {console.log(response)}

    </Box>
      <div>
      {response && response.length > 0 && 
          <SongCollection songs={response} />
        }
      </div>
      </>
    
  );
}
