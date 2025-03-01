import axios from 'axios';
import { standardizeSong } from './standardizeSong.js';
import { saveCollection } from './redisService.js';
import tokenService  from '../services/tokenService.js';
import dotenv from 'dotenv';

dotenv.config();



const APPLE_MUSIC_API_BASE = 'https://api.music.apple.com/v1/catalog/us';
const APPLE_MUSIC_TOKEN = process.env.APPLE_MUSIC_TOKEN;


const findTrackByISRC = async (isrc) => {
    try {
        const token = await tokenService.getAccessToken('spotify');
        const response = await axios.get(`https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track&limit=1`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const spotifyTrack = response.data.tracks.items[0];
        return spotifyTrack ? `https://api.spotify.com/v1/tracks/${spotifyTrack.id}` : null;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};

const findTrackById = async (appleTrackId) => {
    try {
        // Use Apple Music API to get song details
        const appletoken = await tokenService.getAccessToken('appleMusic');
        const response = await axios.get(`https://api.music.apple.com/v1/catalog/us/songs/${appleTrackId}`, {
            headers: { Authorization: `Bearer ${appletoken}` }
        });
   
        const appleTrack = response.data.data[0];
  
        const cleanedAppleTrack = standardizeSong(appleTrack, "appleMusic");
        console.log(cleanedAppleTrack);

        
    
        if (!cleanedAppleTrack.title) {
            return null;
        }
 
        

        // Search Spotify for the song and artist
        const spotifySearchUrl = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(cleanedAppleTrack.title)}+artist:${encodeURIComponent(cleanedAppleTrack.artist)}&type=track&limit=1`;
        const spotifyToken = await tokenService.getAccessToken('spotify');
        const searchResponse = await axios.get(spotifySearchUrl, {
            headers: { Authorization: `Bearer ${spotifyToken}` }
        });


        const spotifyTrack = searchResponse.data.tracks.items[0];
    
        const cleanedSpotifyTrack = standardizeSong(spotifyTrack, "spotify");
        console.log(cleanedSpotifyTrack);

        const isrc = cleanedSpotifyTrack.isrc;
        const res = {
            shareLink: `${process.env.SHARE_LINK_BASE}/collections/${isrc}`,
            songs: []
        };
        

        res.songs.push(cleanedAppleTrack);
        res.songs.push(cleanedSpotifyTrack);

        await saveCollection(isrc,res);
        
        return res;
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
        const appleToken = await tokenService.getAccessToken('appleMusic');
        const appleApiUrl = `https://api.music.apple.com/v1/catalog/us/songs/${appleTrackId}`;
        const appleResponse = await axios.get(appleApiUrl, {
            headers: { Authorization: `Bearer ${appleToken}` }
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
};

export default spotifyService;
