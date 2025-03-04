import axios from 'axios';
import tokenService from '../services/tokenService.js';
import { saveCollection } from './redisService.js';
import { standardizeSong } from './standardizeSong.js';
import dotenv from 'dotenv';

dotenv.config();
const TIDAL_API_BASE = 'https://openapi.tidal.com/v2';

/**
 * Finds a track on Tidal using a Tidal track ID
 * @param {string} tidalTrackId - The Tidal track ID
 * @returns {Promise<object|null>} - Standardized track data
 */
const findTrackById = async (trackId) => {
    const token = await tokenService.getAccessToken('tidal');


    try {
        const TRACK_URL = `https://openapi.tidal.com/v2/tracks/${trackId}?countryCode=US&include=albums%2C%20artists`;
       

        // Get song details from Tidal
        const response = await axios.get(TRACK_URL, {
            headers: { Authorization: `Bearer ${token}` },

        });

        const tidalTrack = standardizeSong(response.data , "tidal");
        return tidalTrack;
    } catch (error) {
        // console.error('Error fetching track by ID from Tidal:', error.response?.data || error.message);
        return null;
    }
};

/**
 * Finds a track on Tidal using ISRC
 * @param {string} isrc - The ISRC code of the track
 * @returns {Promise<string|null>} - The Tidal track URL or null if not found
 */
const findTrackByISRC = async (isrc) => {
    try {
        const token = await tokenService.getAccessToken('tidal');

        const ISRC_URL = `${TIDAL_API_BASE}/tracks?countryCode=US&include=&filter%5Bisrc%5D=${isrc}&filter%5Bid%5D=`
        const response = await axios.get(ISRC_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const trackId = response.data.data[0].id;

        
        return await findTrackById(trackId);
    } catch (error) {
        console.error('Error fetching track by ISRC from Tidal:', error.response?.data || error.message);
        return null;
    }
};



/**
 * Finds a track on Tidal using a link (extracts ISRC and searches)
 * @param {string} tidalTrackId - The Tidal track ID
 * @returns {Promise<object|null>} - Matched tracks from multiple services
 */
const findTrackByLink = async (tidalTrackId) => {
    try {
        const token = await tokenService.getAccessToken('tidal');
        const tidalApiUrl = `${TIDAL_API_BASE}/tracks/${tidalTrackId}`;
        const tidalResponse = await axios.get(tidalApiUrl, { countryCode: 'us' }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const isrc = tidalResponse.data.attributes.isrc;
        if (!isrc) return null;

        return await findTrackById(isrc);
    } catch (error) {
        //  console.error('Error fetching track from Tidal:', error.response?.data || error.message);
        return null;
    }
};

const tidalService = {
    findTrackByISRC,
    findTrackById,
    findTrackByLink
};

export default tidalService;
