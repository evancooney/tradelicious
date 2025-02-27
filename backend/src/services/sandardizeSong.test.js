import { standardizeSong, standardizeCollection } from "./standardizeSong";

describe("Standardize Song Function", () => {
  test("Apple Music song data", () => {
    const appleMusicSong = {
      id: "123456",
      attributes: {
        name: "Test Song",
        artistName: "Test Artist",
        albumName: "Test Album",
        durationInMillis: 210000,
        releaseDate: "2022-01-01",
        artwork: { url: "https://apple.com/art.jpg" },
        isrc: "US-XXX-22-00001",
        url: "https://music.apple.com/song/123456"
      }
    };
    const result = standardizeSong(appleMusicSong, "appleMusic");
    expect(result).toEqual({
      id: "123456",
      title: "Test Song",
      artist: "Test Artist",
      album: "Test Album",
      durationMs: 210000,
      releaseDate: "2022-01-01",
      coverArt: "https://apple.com/art.jpg",
      isrc: "US-XXX-22-00001",
      source: "Apple Music",
      sourceLink: "https://music.apple.com/song/123456"
    });
  });

  test("Spotify song data", () => {
    const spotifySong = {
      id: "abcdef",
      name: "Test Song",
      artists: [{ name: "Test Artist" }],
      album: {
        name: "Test Album",
        release_date: "2022-01-01",
        images: [{ url: "https://spotify.com/art.jpg" }]
      },
      duration_ms: 210000,
      external_ids: { isrc: "US-XXX-22-00001" },
      external_urls: { spotify: "https://open.spotify.com/track/abcdef" }
    };
    const result = standardizeSong(spotifySong, "spotify");
    expect(result).toEqual({
      id: "abcdef",
      title: "Test Song",
      artist: "Test Artist",
      album: "Test Album",
      durationMs: 210000,
      releaseDate: "2022-01-01",
      coverArt: "https://spotify.com/art.jpg",
      isrc: "US-XXX-22-00001",
      source: "Spotify",
      sourceLink: "https://open.spotify.com/track/abcdef"
    });
  });

  test("Tidal song data", () => {
    const tidalSong = {
      id: "tidal123",
      title: "Test Song",
      artists: [{ name: "Test Artist" }],
      album: { title: "Test Album", releaseDate: "2022-01-01", cover: "https://tidal.com/art.jpg" },
      duration: 210000,
      isrc: "US-XXX-22-00001",
      url: "https://tidal.com/browse/track/tidal123"
    };
    const result = standardizeSong(tidalSong, "tidal");
    expect(result).toEqual({
      id: "tidal123",
      title: "Test Song",
      artist: "Test Artist",
      album: "Test Album",
      durationMs: 210000,
      releaseDate: "2022-01-01",
      coverArt: "https://tidal.com/art.jpg",
      isrc: "US-XXX-22-00001",
      source: "Tidal",
      sourceLink: "https://tidal.com/browse/track/tidal123"
    });
  });

  test("Amazon Music song data", () => {
    const amazonSong = {
      asin: "B08XYZ",
      title: "Test Song",
      artists: ["Test Artist"],
      album: { name: "Test Album", releaseDate: "2022-01-01", coverUrl: "https://amazon.com/art.jpg" },
      durationInMilliseconds: 210000,
      isrc: "US-XXX-22-00001",
      url: "https://music.amazon.com/albums/B08XYZ"
    };
    const result = standardizeSong(amazonSong, "amazonMusic");
    expect(result).toEqual({
      id: "B08XYZ",
      title: "Test Song",
      artist: "Test Artist",
      album: "Test Album",
      durationMs: 210000,
      releaseDate: "2022-01-01",
      coverArt: "https://amazon.com/art.jpg",
      isrc: "US-XXX-22-00001",
      source: "Amazon Music",
      sourceLink: "https://music.amazon.com/albums/B08XYZ"
    });
  });
});
