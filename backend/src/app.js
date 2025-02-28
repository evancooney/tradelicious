import express from 'express';
import { createClient } from 'redis';
import appleRoutes from './routes/appleRoutes.js';
import spotifyRoutes from './routes/spotifyRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import collectionsRoutes from "./routes/collectionRoutes.js";
import cors from 'cors';
import 'dotenv/config';


const app = express();
const port = 3333;

app.use(cors());

// see the cache

// Setup Redis client
const redisClient = await createClient({
    url: process.env.REDIS_CONN
})

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  await redisClient.connect();


// Middleware to parse JSON requests
app.use(express.json());

const pathPrefix = process.env.PATH_PREFIX;

// Simple route
app.get(`/`, (req, res) => {
  res.send('Hello, World!');
});

app.get(`/backend`, (req, res) => {
  res.send('lil dojo, World!');
});

// Register Routes
app.use(`/backend/apple`, appleRoutes);
app.use(`/backend/spotify`, spotifyRoutes);
app.use(`/backend/analyze`, analyzeRoutes);
app.use(`/backend/collections`, collectionsRoutes);





export default app;
