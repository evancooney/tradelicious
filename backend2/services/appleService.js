import axios from 'axios';
import { generateAppleToken } from '../middleware/apple.js';
import { getSpotifyToken } from '../middleware/spotify.js';
import dotenv from 'dotenv';

dotenv.config();

const APPLE_MUSIC_API_BASE = 'https://api.music.apple.com/v1/catalog/us';
const APPLE_MUSIC_TOKEN = process.env.APPLE_MUSIC_TOKEN;



const findTrackByISRC = async (isrc) => {
    try {
        const response = await axios.get(`https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${isrc}`, {
            headers: { Authorization: `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkxUQlNZQVE4NzIifQ.eyJpYXQiOjE3NDA1NjIzMzIsImV4cCI6MTc1NjI4NzEzMiwiaXNzIjoiWTNHN1QzNDNZOCJ9.7l5GVFlFM_A05IeuX-6v9S2DfDizffTaq_Mbsa3zFztDHXF9bPspSOS2-uOcK9McSVHhyMMMru9yTiyQVWZYew` }
        });

        const appleTrack = response.data.data[0];
        return appleTrack ? `https://music.apple.com/us/song/${appleTrack.id}` : null;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};

const findTrackById = async (spotifyTrackId) => {
    try {
        // Use Spotify API to get song details
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${spotifyTrackId}`, {
            headers: { Authorization: `Bearer BQCbBE-0f3CyDBaTU6OLvFBJ9y7PqVtk42faXtBTTWg8X3qYKEHGyYLnc8ieJZ3DNyjtXf_AOOCUICsSzBPqYiiOApz3qKU5iyC88R4CkzmKjW3cLHPfTA9Hq9fqAsjEIotUSk-oaGQ`}
        });

        const songName = response.data.name;
        const artistName = response.data.artists[0]?.name;

        if (!songName || !artistName) {
            return null;
        }

        // Search Apple Music for the song and artist
        const appleSearchUrl = `https://api.music.apple.com/v1/catalog/us/search?term=${encodeURIComponent(songName + ' ' + artistName)}&types=songs&limit=1`;

        const searchResponse = await axios.get(appleSearchUrl, {
            headers: { Authorization: `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkxUQlNZQVE4NzIifQ.eyJpYXQiOjE3NDA1NjIzMzIsImV4cCI6MTc1NjI4NzEzMiwiaXNzIjoiWTNHN1QzNDNZOCJ9.7l5GVFlFM_A05IeuX-6v9S2DfDizffTaq_Mbsa3zFztDHXF9bPspSOS2-uOcK9McSVHhyMMMru9yTiyQVWZYew` }
        });

        const appleTrack = searchResponse.data.results.songs.data[0];
        return appleTrack ? `https://music.apple.com/us/song/${appleTrack.id}` : null;
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
        const spotifyApiUrl = `https://api.spotify.com/v1/tracks/${spotifyTrackId}`;
        const spotifyResponse = await axios.get(spotifyApiUrl, {
            headers: { Authorization: `Bearer BQCbBE-0f3CyDBaTU6OLvFBJ9y7PqVtk42faXtBTTWg8X3qYKEHGyYLnc8ieJZ3DNyjtXf_AOOCUICsSzBPqYiiOApz3qKU5iyC88R4CkzmKjW3cLHPfTA9Hq9fqAsjEIotUSk-oaGQ` }
        });

        const isrc = spotifyResponse.data.external_ids.isrc;
        if (!isrc) return null;

        return await findTrackById(isrc);
    } catch (error) {
        console.error('Error fetching track from Spotify:', error.response?.data || error.message);
        return null;
    }
};


const appleService = {
    findTrackByISRC,
    findTrackById,
    findTrackByLink
}

export default appleService;
