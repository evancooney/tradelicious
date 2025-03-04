const standardizeSong = (song, source) => {
  if (source === "appleMusic") {
    return {
      id: song.id,
      title: song.attributes?.name || "Unknown",
      artist: song.attributes?.artistName || "Unknown",
      artistLink: song.attributes?.url?.replace(/\/song\/.*$/, `/artist/${song.attributes?.artistId}`) || null,
      album: song.attributes?.albumName || "Unknown",
      albumLink: song.attributes?.url?.replace(/\/song\/.*$/, `/album/${song.attributes?.albumId}`) || null,
      durationMs: song.attributes?.durationInMillis || 0,
      releaseDate: song.attributes?.releaseDate || "Unknown",
      coverArt: song.attributes?.artwork?.url || null,
      isrc: song.attributes?.isrc || null,
      source: "Apple Music",
      sourceLink: song.attributes?.url || null,
    };
  } else if (source === "spotify") {
    return {
      id: song.id,
      title: song.name || "Unknown",
      artist: song.artists?.map(artist => artist.name).join(", ") || "Unknown",
      artistLink: song.artists?.[0]?.external_urls?.spotify || null,
      album: song.album?.name || "Unknown",
      albumLink: song.album?.external_urls?.spotify || null,
      durationMs: song.duration_ms || 0,
      releaseDate: song.album?.release_date || "Unknown",
      coverArt: song.album?.images?.[0]?.url || null,
      isrc: song.external_ids?.isrc || null,
      source: "Spotify",
      sourceLink: song.external_urls?.spotify || null,
    };
  } else if (source === "tidal") {
    return {
      id: song?.data?.id,
      title: song?.data?.attributes?.title || "Unknown",
      artist: song?.included[1]?.attributes?.name || "Unknown", // Default since the artist info is in relationships
      artistLink: song?.included[1]?.attributes?.externalLinks[0]?.href,
      album: song?.included[0]?.attributes?.title || "Uknown",
      albumLink: song?.included[0]?.attributes?.externalLinks[0]?.href,
      durationMs: parseDuration(song?.data.attributes?.duration) || 0,
      releaseDate: song?.included[0]?.attributes?.releaseDate || "Uknown", // Not provided in attributes
      coverArt: song?.included[0]?.attributes?.imageLinks[5]?.href , // No direct coverArt provided
      isrc: song?.data?.attributes?.isrc || null,
      source: "Tidal",
      sourceLink: song?.data?.attributes?.externalLinks?.find(link => link.meta.type === "TIDAL_SHARING")?.href || null,
    };
  } else if (source === "amazonMusic") {
    return {
      id: song.asin,
      title: song.title || "Unknown",
      artist: song.artists?.join(", ") || "Unknown",
      artistLink: song.artists?.[0]?.id ? `https://music.amazon.com/artists/${song.artists[0].id}` : null,
      album: song.album?.name || "Unknown",
      albumLink: song.album?.id ? `https://music.amazon.com/albums/${song.album.id}` : null,
      durationMs: song.durationInMilliseconds || 0,
      releaseDate: song.album?.releaseDate || "Unknown",
      coverArt: song.album?.coverUrl || null,
      isrc: song.isrc || null,
      source: "Amazon Music",
      sourceLink: song.url || null,
    };
  } else {
    throw new Error("Unsupported source");
  }
};

const parseDuration = (duration) => {
  if (!duration) return 0;
  const match = duration.match(/PT(\d+)M(\d+)S/);
  if (!match) return 0;
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  return (minutes * 60 + seconds) * 1000;
};

const standardizeCollection = (collection, source, type) => {
  return {
    id: collection.id,
    title: collection.name || collection.title || "Unknown",
    creator: collection.owner?.display_name || collection.artistName || collection.author || "Unknown",
    coverArt: collection.images?.[0]?.url || collection.artwork?.url || collection.coverUrl || null,
    releaseDate: collection.release_date || collection.releaseDate || "Unknown",
    type: type, // "album" or "playlist"
    tracks: collection.tracks?.items?.map(item => standardizeSong(item.track || item, source)) || [],
    source: source.charAt(0).toUpperCase() + source.slice(1),
    sourceLink: collection.external_urls?.spotify || collection.url || null,
  };
};

export { standardizeSong, standardizeCollection };
