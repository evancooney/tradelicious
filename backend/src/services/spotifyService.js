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
        const token = await tokenService.getAccessToken('appleMusic');
        const response = await axios.get(`https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${isrc}`, {
            headers: { Authorization: `Bearer ${token}` }});

        const appleTrack = response.data.data[0];
        return appleTrack ? `https://music.apple.com/us/song/${appleTrack.id}` : null;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};

const findTrackById = async (spotifyTrackId) => {
    
    try {
        const spotifyToken = await tokenService.getAccessToken('spotify');

        // Use Spotify API to get song details
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${spotifyTrackId}`, {
            headers: { Authorization: `Bearer ${spotifyToken}`}
        });

        
        

        const songName = response.data.name;
        const artistName = response.data.artists[0]?.name;

        if (!songName || !artistName) {
            return null;
        }
        const cleanedSpotifyTrack = standardizeSong(response.data, "spotify");
        console.log(cleanedSpotifyTrack);

        // Search Apple Music for the song and artist
        const appleSearchUrl = `https://api.music.apple.com/v1/catalog/us/search?term=${encodeURIComponent(songName + ' ' + artistName)}&types=songs&limit=1`;
        const appleToken = await tokenService.getAccessToken('appleMusic');
        const searchResponse = await axios.get(appleSearchUrl, {
            headers: { Authorization: `Bearer ${appleToken}` }
        });

        const appleTrack = searchResponse.data.results.songs.data[0];
        const cleanedAppleTrack = standardizeSong(appleTrack, "appleMusic");
        console.log(cleanedAppleTrack);
        
        const isrc = cleanedAppleTrack.isrc;
        const res = {
            shareLink: `${process.env.SHARE_LINK_BASE}/collections/${isrc}`,
            songs: []
        };
        

        res.songs.push(cleanedAppleTrack);
        res.songs.push(cleanedSpotifyTrack);

        await saveCollection(isrc,res);
        
        return res;
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
