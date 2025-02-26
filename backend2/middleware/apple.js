import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const APPLE_KEY_ID = process.env.APPLE_KEY_ID;
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID;
const APPLE_PRIVATE_KEY_PATH = process.env.APPLE_PRIVATE_KEY_PATH;

let appleToken = null;
let tokenExpiration = 0;

// Function to generate an Apple Music JWT token
const generateAppleToken = () => {
    if (appleToken && Date.now() < tokenExpiration) {
        return appleToken; // Return existing token if still valid
    }

    try {
        const privateKey = fs.readFileSync(path.resolve(APPLE_PRIVATE_KEY_PATH), 'utf8');

        const token = jwt.sign({}, privateKey, {
            algorithm: 'ES256',
            expiresIn: '1h',
            keyid: APPLE_KEY_ID,
            issuer: APPLE_TEAM_ID,
        });

        appleToken = token;
        tokenExpiration = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour

        return appleToken;
    } catch (error) {
        console.error('Error generating Apple Music token:', error.message);
        throw new Error('Failed to generate Apple Music token');
    }
};

// Middleware to attach the token to the request
const appleMiddleware = (req, res, next) => {
    try {
        const token = generateAppleToken();
        req.appleToken = token;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Failed to authenticate with Apple Music' });
    }
};

export { generateAppleToken};

export default appleMiddleware;
