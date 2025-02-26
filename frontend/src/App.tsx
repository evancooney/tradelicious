import { useState, KeyboardEvent } from "react";
import { Button, TextField, Box, Typography, List, ListItem, IconButton, useTheme } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

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
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Box sx={{ p: 4, maxWidth: 400, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: "8px" }}>
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
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Send</Button>
        {response && (
          <Box mt={2} p={2} border={1} borderRadius={1}>
            <Typography variant="body1"><strong>Response:</strong> {JSON.stringify(response)}</Typography>
          </Box>
        )}
        {results.length > 0 && (
          <Box mt={2} p={2} border={1} borderRadius={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Results:</Typography>
              <IconButton onClick={handleClearResults} color="secondary">
                <ClearIcon />
              </IconButton>
            </Box>
            <List>
              {results.map((result, index) => (
                <ListItem key={index}>{JSON.stringify(result)}</ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
}
