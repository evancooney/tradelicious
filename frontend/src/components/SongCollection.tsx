import React from "react";
import { Grid, Container } from "@mui/material";
import SongDisplay from "./SongDisplay";

const SongCollection = ({ songs }) => {
  if (!songs || songs.length === 0) {
    return <p>No songs available</p>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {songs.map((song, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <SongDisplay song={song} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SongCollection;
