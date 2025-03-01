// analyzeMusicUrlWithRegex.ts

export type MusicResourceType = 'song' | 'album' | 'artist' | 'playlist' | 'unknown';
export type MusicPlatform = 'Spotify' | 'AppleMusic' | 'Tidal' | 'YouTubeMusic' | 'Unknown';

export interface AnalyzedMusicUrl {
  service: MusicPlatform;
  type: MusicResourceType;
  id: string | null; // extracted track/album/artist/playlist ID
}

export function analyzeMusicUrl(urlString: string): AnalyzedMusicUrl {
  let service: MusicPlatform = 'Unknown';
  let type: MusicResourceType = 'unknown';
  let id: string | null = null;

  try {
    const url = new URL(urlString);
    const hostname = url.hostname;
    const path = url.pathname; // full path with leading slash

    // =====================
    // SPOTIFY
    // =====================
    if (hostname.includes('spotify.com')) {
      service = 'Spotify';

      const trackMatch = /\/track\/([^/]+)/.exec(path);
      const albumMatch = /\/album\/([^/]+)/.exec(path);
      const artistMatch = /\/artist\/([^/]+)/.exec(path);
      const playlistMatch = /\/playlist\/([^/]+)/.exec(path);

      if (trackMatch) {
        type = 'song';
        id = trackMatch[1];
      } else if (albumMatch) {
        type = 'album';
        id = albumMatch[1];
      } else if (artistMatch) {
        type = 'artist';
        id = artistMatch[1];
      } else if (playlistMatch) {
        type = 'playlist';
        id = playlistMatch[1];
      }
    }

    // =====================
    // APPLE MUSIC
    // =====================
    if (hostname.includes('music.apple.com')) {
      service = 'AppleMusic';

      // Example: https://music.apple.com/us/album/evermore/1540314609
      const appleAlbumMatch = /\/[a-zA-Z]{2}\/album\/[^/]*\/(\d+)/.exec(path);
      const appleArtistMatch = /\/[a-zA-Z]{2}\/artist\/[^/]*\/(\d+)/.exec(path);

      if (appleAlbumMatch) {
        type = 'album';
        id = appleAlbumMatch[1];
      } else if (appleArtistMatch) {
        type = 'artist';
        id = appleArtistMatch[1];
      }
      // For track-level links, Apple Music typically includes album info plus a track index, 
      // but you could add custom logic to parse that out if needed.
    }

    // =====================
    // TIDAL
    // =====================
    if (hostname.includes('tidal.com')) {
      service = 'Tidal';

      const tidalTrackMatch = /\/browse\/track\/([^/]+)/.exec(path);
      const tidalAlbumMatch = /\/browse\/album\/([^/]+)/.exec(path);
      const tidalArtistMatch = /\/browse\/artist\/([^/]+)/.exec(path);

      if (tidalTrackMatch) {
        type = 'song';
        id = tidalTrackMatch[1];
      } else if (tidalAlbumMatch) {
        type = 'album';
        id = tidalAlbumMatch[1];
      } else if (tidalArtistMatch) {
        type = 'artist';
        id = tidalArtistMatch[1];
      }
    }

    // =====================
    // YOUTUBE (Music)
    // =====================
    if (hostname.includes('music.youtube.com') || hostname.includes('youtube.com')) {
      service = 'YouTubeMusic';

      // Playlist => ?list=xxxx
      if (url.searchParams.has('list')) {
        type = 'playlist';
        id = url.searchParams.get('list'); 
      } else if (url.searchParams.has('v')) {
        // e.g. watch?v=xxxx -> typically a "song" in this context
        type = 'song';
        id = url.searchParams.get('v');
      }
    }

    return { service, type, id };
  } catch (error) {
    // If there's a URL parsing error or something unexpected, return unknown
    return { service, type, id };
  }
}

