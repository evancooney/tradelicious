const express = require('express');
const { Queue } = require('bullmq');
const Redis = require('ioredis');

// Create an Express app
const app = express();
app.use(express.json());

// Configure Redis connection (adjust for your environment)
const redisConnection = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

// Create a BullMQ queue instance
const myQueue = new Queue('my-queue-name', {
  connection: redisConnection,
});

// POST /jobs: Accept some data, add a job to the queue
app.post('/jobs', async (req, res) => {
  try {
    // job data from the request body
    const jobData = req.body;

    // Add a job to the queue
    const job = await myQueue.add('processData', jobData, {
      // Optional job options
      removeOnComplete: true, // automatically remove job from Redis after completion
      removeOnFail: false,
      attempts: 3,           // retry up to 3 times if it fails
    });

    // Return job info
    res.json({
      jobId: job.id,
      message: 'Job queued successfully!',
    });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Failed to add job.' });
  }
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Producer (Express) listening on http://localhost:${PORT}`);
});
