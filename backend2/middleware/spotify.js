import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpiration = 0;

// Function to fetch a new access token
const getSpotifyToken = async () => {
    if (accessToken && Date.now() < tokenExpiration) {
        return accessToken; // Return existing token if still valid
    }

    const authString = (`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        accessToken = response.data.access_token;
        tokenExpiration = Date.now() + response.data.expires_in * 1000;

        return accessToken;
    } catch (error) {
        console.error('Error fetching Spotify token:', error.response?.data || error.message);
        throw new Error('Failed to retrieve Spotify token');
    }
};

// Middleware to attach the token to the request
const spotifyMiddleware = async (req, res, next) => {
    try {
        const token = await getSpotifyToken();
        req.spotifyToken = token;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Failed to authenticate with Spotify' });
    }
};

export { getSpotifyToken }

export default spotifyMiddleware;
