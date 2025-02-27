import  tokenService  from "./tokenService.js";
import { standardizeSong } from "./standardizeSong.js";
import axios from "axios";

const searchSpotify = async (query) => {
  const token = await tokenService.getAccessToken("spotify");
  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "track", limit: 5 },
  });
  return response.data.tracks.items.map((song) => standardizeSong(song, "spotify"));
};

const searchAppleMusic = async (query) => {
  const token = await tokenService.getAccessToken("appleMusic");
  const response = await axios.get("https://api.music.apple.com/v1/catalog/us/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { term: query, types: "songs", limit: 5 },
  });
  return response.data.results.songs.data.map((song) => standardizeSong(song, "appleMusic"));
};

const rankMatches = (query, songs) => {
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  return songs.map((song) => {
    const { title, artist, album } = song;
    
    let score = 0;
    if (normalize(title) === normalize(query)) score += 5;
    if (normalize(artist) === normalize(query)) score += 3;
    if (normalize(album) === normalize(query)) score += 3;
    if (normalize(title).includes(normalize(query))) score += 2;
    if (normalize(artist).includes(normalize(query))) score += 1;
    if (normalize(album).includes(normalize(query))) score += 1;
    
    return { song, score };
  }).sort((a, b) => b.score - a.score).map(({ song }) => song);
};

const matchSongsAcrossServices = async (query) => {
  const spotifyResults = await searchSpotify(query);
  const appleResults = await searchAppleMusic(query);
  const allResults = [...spotifyResults, ...appleResults];

  return rankMatches(query, allResults);
};



const matchService = {
    matchSongsAcrossServices
}

export default matchService;
