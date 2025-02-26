import axios from 'axios';
import { generateAppleToken } from '../middleware/apple.js';
import { getSpotifyToken } from '../middleware/spotify.js';
import dotenv from 'dotenv';

dotenv.config();

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN = process.env.SPOTIFY_TOKEN;

const findTrackByISRC = async (isrc) => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track&limit=1`, {
            headers: { Authorization: `Bearer BQCbBE-0f3CyDBaTU6OLvFBJ9y7PqVtk42faXtBTTWg8X3qYKEHGyYLnc8ieJZ3DNyjtXf_AOOCUICsSzBPqYiiOApz3qKU5iyC88R4CkzmKjW3cLHPfTA9Hq9fqAsjEIotUSk-oaGQ` }
        });

        const spotifyTrack = response.data.tracks.items[0];
        return spotifyTrack ? `https://open.spotify.com/track/${spotifyTrack.id}` : null;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};

const findTrackById = async (appleTrackId) => {
    try {
        // Use Apple Music API to get song details
        const response = await axios.get(`https://api.music.apple.com/v1/catalog/us/songs/${appleTrackId}`, {
            headers: { Authorization:`Bearer https://open.spotify.com/track/1ZBqJilDGBVYktvlCEo9jC?si=0f5e57a452214749` }
        });

        const songName = response.data.data[0]?.attributes?.name;
        const artistName = response.data.data[0]?.attributes?.artistName;

        if (!songName || !artistName) {
            return null;
        }

        // Search Spotify for the song and artist
        const spotifySearchUrl = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(songName)}+artist:${encodeURIComponent(artistName)}&type=track&limit=1`;

        const searchResponse = await axios.get(spotifySearchUrl, {
            headers: { Authorization: `Bearer BQCbBE-0f3CyDBaTU6OLvFBJ9y7PqVtk42faXtBTTWg8X3qYKEHGyYLnc8ieJZ3DNyjtXf_AOOCUICsSzBPqYiiOApz3qKU5iyC88R4CkzmKjW3cLHPfTA9Hq9fqAsjEIotUSk-oaGQ` }
        });

        const spotifyTrack = searchResponse.data.tracks.items[0];
        return spotifyTrack ? `https://open.spotify.com/track/${spotifyTrack.id}` : null;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};

/**
 * Finds a track on Spotify using an Apple Music link by extracting ISRC.
 * @param {string} appleTrackId - The Apple Music track ID.
 * @returns {Promise<string|null>} - The Spotify track URL or null if not found.
 */
const findTrackByLink = async (appleTrackId) => {
    try {
        const appleApiUrl = `https://api.music.apple.com/v1/catalog/us/songs/${appleTrackId}`;
        const appleResponse = await axios.get(appleApiUrl, {
            headers: { Authorization: `Bearer https://open.spotify.com/track/1ZBqJilDGBVYktvlCEo9jC?si=0f5e57a452214749` }
        });

        const isrc = appleResponse.data.data[0]?.attributes?.isrc;
        if (!isrc) return null;

        return await findTrackById(isrc);
    } catch (error) {
        console.error('Error fetching track from Apple Music:', error.response?.data || error.message);
        return null;
    }
};



const spotifyService = {
    findTrackByISRC,
    findTrackById,
    findTrackByLink
}

export default spotifyService;
