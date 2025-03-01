import NodeCache from "node-cache";
import axios from "axios";

const cache = new NodeCache();

const getAccessToken = async (provider) => {
  const cacheKey = `token:${provider}`;
  const cachedToken = cache.get(cacheKey);
  console.log('cachedVersion', cachedToken);
  if (cachedToken) {
    return cachedToken;
  }

  let tokenEndpoint;
  if (provider === "spotify") {
    tokenEndpoint = process.env.SPOTIFY_TOKEN_ENDPOINT;
  } else if (provider === "appleMusic") {
    tokenEndpoint = process.env.APPLE_MUSIC_TOKEN_ENDPOINT;
  } else if (provider === "tidal") {
    tokenEndpoint = process.env.TIDAL_TOKEN_ENDPOINT;
  } else {
    throw new Error("Unsupported provider");
  }

  const tokenResponse = await axios.get(tokenEndpoint);
 
  const expiresIn = provider === "spotify" || provider === "tidal" ? 240 : 86400; // 4 minutes for Spotify, 24 hours for Apple Music
  
  cache.set(cacheKey, tokenResponse.data, expiresIn);
  console.log(tokenResponse.data);
  return tokenResponse.data;
};

const tokenService = {
  getAccessToken
};

export default tokenService;

