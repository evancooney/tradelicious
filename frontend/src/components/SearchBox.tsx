import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const GoogleSearchBox = ({ onSearch, query, setQuery }) => {
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
     
        bgcolor: "background.default",
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 600,
          p: 1,
          borderRadius: "50px",
          boxShadow: 3,
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Enter a link for Spotify or Apple Music and we'll convert it"
          InputProps={{ disableUnderline: true }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={(e) => setQuery('')}
          sx={{ ml: 2, flex: 1 }}
        />
        <Button type="submit" sx={{ borderRadius: "50px", minWidth: "50px" }}>
          <SearchIcon />
        </Button>
        
      </Paper>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2, color: '#AAA', fontSize: 14 }}>
       
      </Typography>
    </Box>
  );
};

export default GoogleSearchBox;
