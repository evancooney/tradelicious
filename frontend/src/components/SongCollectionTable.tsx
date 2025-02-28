import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, IconButton, TextField, Card, CardContent } from "@mui/material";
import { FaSpotify, FaApple } from "react-icons/fa";
import { ContentCopy } from "@mui/icons-material";

interface Song {
  source: string;
  sourceLink: string;
  title: string;
  artist: string;
  artistLink?: string;
  album: string;
  albumLink?: string;
  durationMs: number;
  releaseDate: string;
  coverArt: string;
}

interface SongCollectionTableProps {
  songs: Song[];
  shareLink: string;
}


const SongCollectionTable: React.FC<SongCollectionTableProps> = ({ songs, shareLink }) => {
  const getSourceIcon = (source:string, link:string) => {
    let icon;
    switch (source) {
      case "Spotify":
        icon = <FaSpotify style={{ color: "#1DB954", fontSize: 50 }} />;
        break;
      case "Apple Music":
        icon = <FaApple style={{ color: "#FA243C", fontSize: 50 }} />;
        break;
      default:
        return <Box width={50} height={50} bgcolor="black" />;
    }
    
    return link ? <a href={link} target="_blank" rel="noopener noreferrer">{icon}</a> : icon;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    <Box>
      {/* Share Link Section */}
      <div style={{ maxWidth: 570, margin: "auto", paddingTop: 20 }}>
        <Box sx={{ mt: 2, p: 2, margin: "auto", bgcolor: "#f0f0f0", borderRadius: 2, display: "flex", alignItems: "center", position: "relative" }}>
          <TextField fullWidth label="Shareable link" value={shareLink} variant="outlined" InputProps={{ readOnly: true }} />
          <IconButton onClick={copyToClipboard} sx={{ position: "absolute", right: 10 }}>

            <ContentCopy />
          </IconButton>
        </Box>
      </div>

      {/* Table View for Large Screens */}
      <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, overflowX: "auto", width: "100%", display: { xs: "none", md: "block" } }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Open</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Artist</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Album</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Release Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cover</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((song, index) => (
              <TableRow key={index}>
                <TableCell align="center">{getSourceIcon(song.source, song.sourceLink)}</TableCell>
                <TableCell>
                  <a href={song.sourceLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1E90FF" }}>{song.title}</a>
                </TableCell>
                <TableCell>
                  {song.artistLink ? (
                    <a href={song.artistLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1E90FF" }}>{song.artist}</a>
                  ) : (
                    song.artist
                  )}
                </TableCell>
                <TableCell>
                  {song.albumLink ? (
                    <a href={song.albumLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1E90FF" }}>{song.album}</a>
                  ) : (
                    song.album
                  )}
                </TableCell>
                <TableCell>{(song.durationMs / 1000).toFixed(2)} sec</TableCell>
                <TableCell>{song.releaseDate}</TableCell>
                <TableCell>
                  <img src={song.coverArt} alt={song.title} width={50} height={50} style={{ borderRadius: "5px", display: "block" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile View - Vertical Cards */}
      <Box sx={{ display: { xs: "block", md: "none" }, mt: 2, p: 2 }}>
        {songs.map((song, index) => (
          <Card key={index} sx={{ mb: 2, p: 2, boxShadow: 3, textAlign: "left" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Box mr={2}>{getSourceIcon(song.source, song.sourceLink)}</Box>
                <Box>
                  <Typography variant="h6">
                    <a href={song.sourceLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1E90FF" }}>{song.title}</a>
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {song.artistLink ? (
                      <a href={song.artistLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1E90FF" }}>{song.artist}</a>
                    ) : (
                      song.artist
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {song.albumLink ? (
                      <a href={song.albumLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1E90FF" }}>{song.album}</a>
                    ) : (
                      song.album
                    )}
                  </Typography>
                </Box>
              </Box>
              
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default SongCollectionTable;
