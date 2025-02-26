import express from 'express';
import redis from 'redis';
import appleRoutes from './routes/appleRoutes.js';
import spotifyRoutes from './routes/spotifyRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import cors from 'cors';


const app = express();
const port = 3000;

app.use(cors());

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



export default app;
