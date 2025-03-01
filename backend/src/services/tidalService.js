import axios from 'axios';
import tokenService from '../services/tokenService.js';
import { saveCollection } from './redisService.js';
import { standardizeSong } from './standardizeSong.js';
import dotenv from 'dotenv';

dotenv.config();
const TIDAL_API_BASE = 'https://openapi.tidal.com/v2';

/**
 * Finds a track on Tidal using ISRC
 * @param {string} isrc - The ISRC code of the track
 * @returns {Promise<string|null>} - The Tidal track URL or null if not found
 */
const findTrackByISRC = async (isrc) => {
    try {
        const token = await tokenService.getAccessToken('tidal');
       
        const response = await axios.get(`${TIDAL_API_BASE}/search/tracks`, {
            params: { query: isrc, limit: 1, countryCode: 'us' },
            headers: { Authorization: `Bearer ${token}` }
        });

        const tidalTrack = response.data.items?.[0];
        return tidalTrack ? `https://tidal.com/browse/track/${tidalTrack.id}` : null;
    } catch (error) {
       // console.error('Error fetching track by ISRC from Tidal:', error.response?.data || error.message);
        return null;
    }
};

/**
 * Finds a track on Tidal using a Tidal track ID
 * @param {string} tidalTrackId - The Tidal track ID
 * @returns {Promise<object|null>} - Standardized track data
 */
const findTrackById = async (tidalTrackId) => {
    const token = await tokenService.getAccessToken('tidal');
    
    
    try {
        
        
       

        // Get song details from Tidal
        const response = await axios.get(`${TIDAL_API_BASE}/tracks/${tidalTrackId}?countryCode=us`, {
            headers: { Authorization: `Bearer ${token}` },
           
        });
        
        

        const tidalTrack = {...response.data.data };


        const cleanedTidalTrack = standardizeSong(tidalTrack, "tidal");


        const isrc = cleanedTidalTrack.isrc;

        // Search Apple Music using ISRC
        const appleToken = await tokenService.getAccessToken('appleMusic');
        const appleSearchUrl = `https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${isrc}`;
        const appleResponse = await axios.get(appleSearchUrl, {
            headers: { Authorization: `Bearer ${appleToken}` }
        });

        const appleTrack = appleResponse.data.data?.[0];
        const cleanedAppleTrack = appleTrack ? standardizeSong(appleTrack, "appleMusic") : null;
        console.log("Apple Music Track:", cleanedAppleTrack);

        const res = {
            shareLink: `${process.env.SHARE_LINK_BASE}/collections/${isrc}`,
            songs: [cleanedTidalTrack]
        };

        if (cleanedAppleTrack) {
            res.songs.push(cleanedAppleTrack);
        }

        await saveCollection(isrc, res);
        return res;
    } catch (error) {
        // console.error('Error fetching track by ID from Tidal:', error.response?.data || error.message);
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
        const tidalResponse = await axios.get(tidalApiUrl, { countryCode: 'us'} ,{
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
