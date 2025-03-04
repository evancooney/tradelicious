import axios from 'axios';
import tokenService  from '../services/tokenService.js';
import { saveCollection } from './redisService.js';
import { standardizeSong } from './standardizeSong.js';
import dotenv from 'dotenv';

dotenv.config();

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN = process.env.SPOTIFY_TOKEN;



const findTrackByISRC = async (isrc) => {
    try {
        const token = await tokenService.getAccessToken('spotify');
        const response = await axios.get(`https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track&limit=1`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const spotifyTrack = standardizeSong(response.data.tracks.items[0], "spotify");
        return spotifyTrack;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};

const findByArtistAndTitle = async (artist, title) => {
    // Search Spotify for the song and artist
    const spotifySearchUrl = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(title)}+artist:${encodeURIComponent(artist)}&type=track&limit=1`;
    const spotifyToken = await tokenService.getAccessToken('spotify');
    const searchResponse = await axios.get(spotifySearchUrl, {
        headers: { Authorization: `Bearer ${spotifyToken}` }
    });


    const spotifyTrack = standardizeSong(searchResponse.data.tracks.items[0], "spotify");
    
    return spotifyTrack;
};

const findTrackById = async (spotifyTrackId) => {
    
    try {
        const spotifyToken = await tokenService.getAccessToken('spotify');

        // Use Spotify API to get song details
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${spotifyTrackId}`, {
            headers: { Authorization: `Bearer ${spotifyToken}`}
        });

        console.log(response.data);

        const spotifyTrack = standardizeSong(response.data, "spotify");

    
      
        
        return spotifyTrack;
        // return appleTrack ? `https://music.apple.com/us/song/${appleTrack.id}` : null;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};



/**
 * Finds a track on Apple Music using a Spotify link by extracting ISRC.
 * @param {string} spotifyTrackId - The Spotify track ID.
 * @returns {Promise<string|null>} - The Apple Music track URL or null if not found.
 */
const findTrackByLink = async (spotifyTrackId) => {
    try {
        const token = await tokenService.getAccessToken('spotify');
        const spotifyApiUrl = `https://api.spotify.com/v1/tracks/${spotifyTrackId}`;
        const spotifyResponse = await axios.get(spotifyApiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const isrc = spotifyResponse.data.external_ids.isrc;
        if (!isrc) return null;

        return await findTrackById(isrc);
    } catch (error) {
        console.error('Error fetching track from Spotify:', error.response?.data || error.message);
        return null;
    }
};


const spotifyService = {
    findTrackByISRC,
    findTrackById,
    findTrackByLink
};

export default spotifyService;
