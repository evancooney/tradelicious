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
        const token = await tokenService.getAccessToken('appleMusic');
        const response = await axios.get(`https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${isrc}`, {
            headers: { Authorization: `Bearer ${token}` }});

        const appleTrack = standardizeSong(response.data.data[0], "appleMusic");
        return appleTrack;
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
  
        const appleTrack = standardizeSong(response.data.data[0], "appleMusic");

        
        return appleTrack;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};

const findByTitleArtistAlbum = async (title,artist, album ) => {
    
    try {
        

        // Search Apple Music for the song and artist
        const appleSearchUrl = `https://api.music.apple.com/v1/catalog/us/search?term=${encodeURIComponent(title + ' ' + artist + ' ' + album)}&types=songs&limit=1`;
        const appleToken = await tokenService.getAccessToken('appleMusic');
        const searchResponse = await axios.get(appleSearchUrl, {
            headers: { Authorization: `Bearer ${appleToken}` }
        });

        const appleTrack =  standardizeSong(searchResponse.data.results.songs.data[0], "appleMusic");

        
    
        
        return appleTrack;
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



const appleService = {
    findTrackByISRC,
    findTrackById,
    findTrackByLink,
    findByTitleArtistAlbum,
};

export default appleService;
