const { Worker } = require('bullmq');
const Redis = require('ioredis');

// Create a Redis connection
const redisConnection = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

// Create a worker for the same queue name
const myWorker = new Worker(
  'my-queue-name',
  async (job) => {
    // This is where you process the job
    console.log('Processing job:', job.id);
    console.log('Job data:', job.data);

    // Example: do something with job.data
    // e.g., call an external API, run a DB query, etc.
    // For demonstration, just pretend we're doing some work:
    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate 2s of processing

    // Return a result (BullMQ will store it under job.returnvalue)
    return { status: 'ok', processedName: job.data.name };
  },
  { connection: redisConnection }
);

// Optional: Listen to various events
myWorker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed! Result:`, result);
});

myWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err);
});

console.log('Worker listening for jobs...');
