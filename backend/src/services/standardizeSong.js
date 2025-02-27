const standardizeSong = (song, source) => {
    if (source === "appleMusic") {
      return {
        id: song.id,
        title: song.attributes.name,
        artist: song.attributes.artistName,
        album: song.attributes.albumName,
        durationMs: song.attributes.durationInMillis,
        releaseDate: song.attributes.releaseDate,
        coverArt: song.attributes.artwork.url,
        isrc: song.attributes.isrc,
        source: "Apple Music",
        sourceLink: song.attributes.url,
      };
    } else if (source === "spotify") {
      return {
        id: song.id,
        title: song.name,
        artist: song.artists.map(artist => artist.name).join(", "),
        album: song.album.name,
        durationMs: song.duration_ms,
        releaseDate: song.album.release_date,
        coverArt: song.album.images[0]?.url,
        isrc: song.external_ids?.isrc,
        source: "Spotify",
        sourceLink: song.external_urls?.spotify,
      };
    } else if (source === "tidal") {
      return {
        id: song.id,
        title: song.title,
        artist: song.artists.map(artist => artist.name).join(", "),
        album: song.album.title,
        durationMs: song.duration,
        releaseDate: song.album.releaseDate,
        coverArt: song.album.cover,
        isrc: song.isrc,
        source: "Tidal",
        sourceLink: song.url,
      };
    } else if (source === "amazonMusic") {
      return {
        id: song.asin,
        title: song.title,
        artist: song.artists.join(", "),
        album: song.album.name,
        durationMs: song.durationInMilliseconds,
        releaseDate: song.album.releaseDate,
        coverArt: song.album.coverUrl,
        isrc: song.isrc,
        source: "Amazon Music",
        sourceLink: song.url,
      };
    } else {
      throw new Error("Unsupported source");
    }
  };
  
  const standardizeCollection = (collection, source, type) => {
    return {
      id: collection.id,
      title: collection.name || collection.title,
      creator: collection.owner?.display_name || collection.artistName || collection.author,
      coverArt: collection.images?.[0]?.url || collection.artwork?.url || collection.coverUrl,
      releaseDate: collection.release_date || collection.releaseDate,
      type: type, // "album" or "playlist"
      tracks: collection.tracks?.items?.map(item => standardizeSong(item.track || item, source)) || [],
      source: source.charAt(0).toUpperCase() + source.slice(1),
      sourceLink: collection.external_urls?.spotify || collection.url,
    };
  };
  
  export { standardizeSong, standardizeCollection };
  