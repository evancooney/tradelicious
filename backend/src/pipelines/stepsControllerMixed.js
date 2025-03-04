// pipeline/exampleParallelUsage.js
import { runPipelineMixed } from './mixedPipeline.js';
import {
  findBySpotifyTrack,
  findByAppleIsrc,
  findByTidalIsrc
} from '../services/musicServices.js';

// Single function for sequential step
async function stepSpotify(context) {
  // we read trackId from context
  const { spotifyTrackId } = context;
  const spotifyData = await findBySpotifyTrack(spotifyTrackId);
  // e.g. returns { isrc: 'USUM71703861', title: 'Some Song' }
  return spotifyData;
}

// For parallel steps, we can define separate functions
async function stepApple(context) {
  const { isrc } = context;
  return findByAppleIsrc(isrc);
}

async function stepTidal(context) {
  const { isrc } = context;
  return findByTidalIsrc(isrc);
}

// A final step that runs after all parallel steps
async function stepFinal(context) {
  // maybe store in DB or do final transformations
  return { saved: true };
}

// Here’s how we define our pipeline steps array:
export function runMyParallelPipeline(spotifyTrackId) {
  const steps = [
    stepSpotify, // sequential
    [stepApple, stepTidal], // parallel
    stepFinal // sequential
  ];

  // Provide the trackId in initial context
  return runPipelineMixed(steps, { spotifyTrackId });
}
