// routes/music.js
import { Router } from 'express';
import Redis from 'ioredis';
import { runTrackScanPipeline } from './stepsController.js';

const router = Router();
const redis = new Redis(process.env.REDIS_CONN);

router.get('/backend/pipeline', async (req, res) => {
  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const spotifyTrackId = req.query.trackId;

  // 1) Start the pipeline
  const { emitter, promise } = runTrackScanPipeline(spotifyTrackId);

  // 2) Attach SSE listeners
  emitter.on('step', (payload) => {
    // e.g., { step, result, updatedContext }
    res.write(`event: step\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  });

  emitter.on('done', async ({ results, finalContext }) => {
    // 3) Possibly store results in Redis
    try {
      const redisKey = `music:scan:${spotifyTrackId}`;
      await redis.set(redisKey, JSON.stringify(results));
    } catch (err) {
      // If storing fails, we can emit an error event or just log it
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    }

    // 4) Send "done" SSE event and close
    res.write(`event: done\n`);
    res.write(`data: ${JSON.stringify({ results, finalContext })}\n\n`);
    res.end();
  });

  emitter.on('error', (err) => {
    // 5) On error, let the client know
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  });

  // 6) (Optional) handle pipeline promise if needed
  promise.catch((err) => {
    console.error('track-scan pipeline error:', err);
  });
});

export default router;
