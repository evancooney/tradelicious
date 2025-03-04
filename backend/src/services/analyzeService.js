import appleService from '../services/appleService.js';
import spotifyService from '../services/spotifyService.js';
import tidalService from './tidalService.js';
import matchService from './matchService.js';
import { saveCollection } from './redisService.js';


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
        trackId = url.split('track/')[1].split('?')[0]; 
        const spotifyTrack = await spotifyService.findTrackById(trackId);
        
        
        const isrc = spotifyTrack.isrc;
        
        
        const appleTrack = await appleService.findByTitleArtistAlbum(
            spotifyTrack.title, spotifyTrack.artist, spotifyTrack.album);
        const tidalTrack = await tidalService.findTrackByISRC(isrc);
        
        const shareLink = `${process.env.SHARE_LINK_BASE}/collections/${isrc}`;
        const songs = [];
        songs.push(appleTrack);
        songs.push(spotifyTrack);
        songs.push(tidalTrack);

        await saveCollection(isrc, {shareLink, songs, });

        return { shareLink, songs};

  
    } else if (url.includes('music.apple.com')) {
        trackId = extractTrackId(url); // Extract Apple Music track ID
        const appleTrack = await appleService.findTrackById(trackId);
        const isrc = appleTrack.isrc;

        const spotifyTrack = await spotifyService.findTrackByISRC(isrc);
        const tidalTrack = await tidalService.findTrackByISRC(isrc);
        const shareLink = `${process.env.SHARE_LINK_BASE}/collections/${isrc}`;


        const songs = [];
        songs.push(tidalTrack);
        songs.push(spotifyTrack);
        songs.push(appleTrack);

        await saveCollection(isrc, {shareLink, songs, });
        
        return { shareLink, songs};
        
    } else if (url.includes('tidal.com/browse/trac')) {
        trackId = extractTidalTrackId(url); // Extract Apple Music track ID
        const tidalTrack = await tidalService.findTrackById(trackId);
        const isrc = tidalTrack.isrc;
        const shareLink = `${process.env.SHARE_LINK_BASE}/collections/${isrc}`;

        const spotifyTrack = await spotifyService.findTrackByISRC(isrc);
        const appleTrack = await appleService.findByTitleArtistAlbum(
            spotifyTrack.title, spotifyTrack.artist, spotifyTrack.album);

        const songs = [];
        songs.push(tidalTrack);
        songs.push(spotifyTrack);
        songs.push(appleTrack);

        await saveCollection(isrc, {shareLink, songs, });

        return { shareLink, songs};
        

    } else if(!url.startsWith('http')) {
        console.log('got here?', url);
        const results = await matchService.matchSongsAcrossServices(url);
        return results;
    
    } else {
        throw new Error('Unsupported link format');
        return;
    }

};

const AnalyzeServer = {
    analyzeTrack
};

export default AnalyzeServer;
