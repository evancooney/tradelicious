import Redis from "ioredis";
import 'dotenv/config';

const redis = new Redis(process.env.REDIS_CONN); // Connects to Redis on localhost:6379 by default

const COLLECTION_PREFIX = "songCollection:";

/**
 * Saves a collection of songs to Redis
 * @param {string} collectionId - Unique ID for the collection
 * @param {object} collection - Collection object containing songs
 * @param {number} [ttl=86400] - Expiry time in seconds (default: 24 hours)
 */
const saveCollection = async (collectionId, collection, ttl = 86400) => {
  try {
    const key = `${COLLECTION_PREFIX}${collectionId}`;
    await redis.set(key, JSON.stringify(collection), "EX", ttl);
    console.log(`Collection ${collectionId} saved.`);
  } catch (error) {
    console.error("Error saving collection:", error);
  }
};

/**
 * Retrieves a collection from Redis
 * @param {string} collectionId - The collection ID
 * @returns {object|null} - The retrieved collection or null if not found
 */
const getCollection = async (collectionId) => {
  try {
    const key = `${COLLECTION_PREFIX}${collectionId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error retrieving collection:", error);
    return null;
  }
};

/**
 * Deletes a collection from Redis
 * @param {string} collectionId - The collection ID to delete
 */
const deleteCollection = async (collectionId) => {
  try {
    const key = `${COLLECTION_PREFIX}${collectionId}`;
    await redis.del(key);
    console.log(`Collection ${collectionId} deleted.`);
  } catch (error) {
    console.error("Error deleting collection:", error);
  }
};

export { saveCollection, getCollection, deleteCollection };
