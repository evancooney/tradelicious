import React from "react";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";

const SongDisplay = ({ song }) => {
  if (!song) return null;

  return (
    <Card sx={{ maxWidth: 1000, m: 2, p: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="150"
        image={song.coverArt}
        alt={song.title}
        sx={{ borderRadius: 2 }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {song.title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Artist:</strong> {song.artist}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Album:</strong> {song.album}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Duration:</strong> {(song.durationMs / 1000).toFixed(2)} sec
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Release Date:</strong> {song.releaseDate}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Source:</strong> <a href={song.sourceLink}> {song.source} </a>
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>ISRC:</strong> {song.isrc}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SongDisplay;
