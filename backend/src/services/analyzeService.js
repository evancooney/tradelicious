import appleService from '../services/appleService.js';
import spotifyService from '../services/spotifyService.js';
import tidalService from '../services/tidalService.js';
import matchService from './matchService.js';

const extractTrackId = (url) => {
    const match = url.match(/[?&]i=(\d+)/);
    return match ? match[1] : null;
  };

  const extractTidalTrackId = (url) => {
    const match = url.match(/\/(\d+)(?:\?|$)/);
    return match ? match[1] : null;
};




const analyzeTrack = async (url) => {
    if (!url) {
        throw new Error('No URL provided');
    }
    let service, trackId, platform, lookupFunction;

    if (url.includes('spotify.com/track/')) {
        trackId = url.split('track/')[1].split('?')[0]; // Extract Spotify track ID
        service = spotifyService;
        platform = 'Spotify';
        lookupFunction = service.findTrackById;
    } else if (url.includes('music.apple.com')) {
        trackId = extractTrackId(url) // Extract Apple Music track ID
        
        service = appleService;
        platform = 'AppleMusic';
        lookupFunction = service.findTrackById;
    } else if (url.includes('tidal.com/browse/trac')) {
        trackId = extractTidalTrackId(url) // Extract Apple Music track ID

        service = tidalService;
        platform = 'Tidal';
        lookupFunction = service.findTrackById;
    } else if(!url.startsWith('http')) {
        console.log('got here?', url)
        const results = await matchService.matchSongsAcrossServices(url)
        return results;
    
    } else {
        throw new Error('Unsupported link format');
    }

    try {
        console.log(`🔍 Looking up track: ${trackId} on ${platform}`);
        const result = await lookupFunction(trackId);

        if (!result) {
            throw new Error(`No matching track found on ${platform}`);
        }

        return result;
    } catch (error) {
        console.error(`❌ Error processing request for ${trackId} on ${platform}:`, error.message);
        throw new Error('Error processing request');
    }
};

const AnalyzeServer = {
    analyzeTrack
}

export default AnalyzeServer;
