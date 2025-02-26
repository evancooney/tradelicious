import appleService from '../services/appleService.js';
import spotifyService from '../services/spotifyService.js';


const analyzeTrack = async (url) => {
    if (!url) {
        throw new Error('No URL provided');
    }

    let service, trackId, platform, lookupFunction;

    if (url.includes('spotify.com/track/')) {
        trackId = url.split('track/')[1].split('?')[0]; // Extract Spotify track ID
        service = appleService;
        platform = 'Spotify';
        lookupFunction = service.findTrackByLink;
    } else if (url.includes('music.apple.com/song/')) {
        trackId = url.split('/song/')[1]?.split('?')[0]; // Extract Apple Music track ID
        service = spotifyService;
        platform = 'Apple Music';
        lookupFunction = service.findTrackByLink;
    } else {
        throw new Error('Unsupported link format');
    }

    try {
        console.log(`🔍 Looking up track: ${trackId} on ${platform}`);
        const result = await lookupFunction(trackId);

        if (!result) {
            throw new Error(`No matching track found on ${platform}`);
        }

        return { originalUrl: url, convertedUrl: result };
    } catch (error) {
        console.error(`❌ Error processing request for ${trackId} on ${platform}:`, error.message);
        throw new Error('Error processing request');
    }
};

const AnalyzeServer = {
    analyzeTrack
}

export default AnalyzeServer;
