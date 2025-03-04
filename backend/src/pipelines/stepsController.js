// pipeline/trackScanPipeline.js
import { runPipeline } from './pipelineRunner.js';
import { findBySpotifyTrack, findByAppleIsrc } from './step.js';

export function runTrackScanPipeline(spotifyTrackId) {
  const steps = [
    async function stepSpotify(context) {
      // just pass the ID in context
      context.spotifyTrackId = spotifyTrackId;
      return findBySpotifyTrack(context);
    },
    async function stepApple(context) {
      if (!context.isrc) {
        throw new Error('ISRC not found in Spotify data');
      }
      return findByAppleIsrc(context);
    },
    // More steps? Tidal, Deezer, etc.
  ];

  // We can also pass an initial context if we want
  return runPipeline(steps, { spotifyTrackId });
}
