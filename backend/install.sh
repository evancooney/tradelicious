#!/bin/bash

# Set project name
PROJECT_NAME="music-link-converter"
echo "Setting up project: $PROJECT_NAME"

# Create project directories
mkdir -p $PROJECT_NAME/{routes,services,tests}
cd $PROJECT_NAME

# Initialize npm and install dependencies
echo "Initializing npm..."
npm init -y

echo "Installing dependencies..."
npm install express redis supertest jest dotenv

# Create .env file
echo "Creating .env file..."
cat <<EOL > .env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
APPLE_KEY_ID=your_key_id
APPLE_TEAM_ID=your_team_id
APPLE_PRIVATE_KEY_PATH=path/to/AuthKey.p8
EOL

# Create index.js
echo "Creating index.js..."
cat <<EOL > index.js
import express from 'express';
import redis from 'redis';
import appleRoutes from './routes/appleRoutes.js';
import spotifyRoutes from './routes/spotifyRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';

const app = express();
const port = 3000;

// Setup Redis client
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

// Middleware to parse JSON requests
app.use(express.json());

// Register Routes
app.use('/apple', appleRoutes);
app.use('/spotify', spotifyRoutes);
app.use('/analyze', analyzeRoutes);

// Simple route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(\`Server is running on http://localhost:\${port}\`);
});

export default app;
EOL

# Create routes/appleRoutes.js
echo "Creating routes/appleRoutes.js..."
cat <<EOL > routes/appleRoutes.js
import express from 'express';
import appleService from '../services/appleService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { action, type, isrc } = req.body;

    if (action === 'find' && isrc) {
        try {
            const result = await appleService.findTrackByISRC(isrc);
            return res.json({ convertedUrl: result });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching track', error: error.message });
        }
    }

    res.status(400).json({ message: 'Invalid request' });
});

export default router;
EOL

# Create routes/spotifyRoutes.js
echo "Creating routes/spotifyRoutes.js..."
cat <<EOL > routes/spotifyRoutes.js
import express from 'express';
import spotifyService from '../services/spotifyService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { action, type, isrc } = req.body;

    if (action === 'find' && isrc) {
        try {
            const result = await spotifyService.findTrackByISRC(isrc);
            return res.json({ convertedUrl: result });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching track', error: error.message });
        }
    }

    res.status(400).json({ message: 'Invalid request' });
});

export default router;
EOL

# Create services/appleService.js
echo "Creating services/appleService.js..."
cat <<EOL > services/appleService.js
import axios from 'axios';

const findTrackByISRC = async (isrc) => {
    try {
        const response = await axios.get(\`https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=\${isrc}\`, {
            headers: { Authorization: \`Bearer YOUR_APPLE_MUSIC_TOKEN\` }
        });

        const appleTrack = response.data.data[0];
        return appleTrack ? \`https://music.apple.com/us/song/\${appleTrack.id}\` : null;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};

export default { findTrackByISRC };
EOL

# Create services/spotifyService.js
echo "Creating services/spotifyService.js..."
cat <<EOL > services/spotifyService.js
import axios from 'axios';

const findTrackByISRC = async (isrc) => {
    try {
        const response = await axios.get(\`https://api.spotify.com/v1/search?q=isrc:\${isrc}&type=track&limit=1\`, {
            headers: { Authorization: \`Bearer YOUR_SPOTIFY_TOKEN\` }
        });

        const spotifyTrack = response.data.tracks.items[0];
        return spotifyTrack ? \`https://open.spotify.com/track/\${spotifyTrack.id}\` : null;
    } catch (error) {
        console.error('Error fetching track:', error);
        return null;
    }
};

export default { findTrackByISRC };
EOL

# Create tests/appleRoutes.test.js
echo "Creating tests/appleRoutes.test.js..."
cat <<EOL > tests/appleRoutes.test.js
import request from 'supertest';
import app from '../index.js';

jest.mock('../services/appleService.js', () => ({
    findTrackByISRC: jest.fn().mockResolvedValue('https://music.apple.com/us/song/1234567890'),
}));

test('Apple track search should return mocked Spotify link', async () => {
    const response = await request(app).post('/apple').send({ action: 'find', type: 'track', isrc: 'USUM71900719' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ convertedUrl: 'https://music.apple.com/us/song/1234567890' });
});
EOL

# Create tests/spotifyRoutes.test.js
echo "Creating tests/spotifyRoutes.test.js..."
cat <<EOL > tests/spotifyRoutes.test.js
import request from 'supertest';
import app from '../index.js';

jest.mock('../services/spotifyService.js', () => ({
    findTrackByISRC: jest.fn().mockResolvedValue('https://open.spotify.com/track/0987654321'),
}));

test('Spotify track search should return mocked Apple link', async () => {
    const response = await request(app).post('/spotify').send({ action: 'find', type: 'track', isrc: 'USUM71900719' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ convertedUrl: 'https://open.spotify.com/track/0987654321' });
});
EOL

# Initialize Git repository
git init
echo "node_modules/" > .gitignore
git add .
git commit -m "Initial commit"

echo "Setup complete! 🚀"
echo "Run 'node index.js' to start the server."
echo "Run 'NODE_ENV=test jest' to execute tests."
