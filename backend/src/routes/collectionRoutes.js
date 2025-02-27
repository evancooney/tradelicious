import express from "express";
import { saveCollection, getCollection, deleteCollection } from "../services/redisService.js";
import { standardizeCollection } from "../services/standardizeSong.js";

const router = express.Router();

/**
 * @route POST /collections/:id
 * @desc Save a new collection
 * @access Public
 */
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { collection, source, type } = req.body;

  if (!collection || !source || !type) {
    return res.status(400).json({ error: "Missing collection, source, or type" });
  }

  try {
    const standardizedCollection = standardizeCollection(collection, source, type);
    await saveCollection(id, standardizedCollection);
    res.status(201).json({ message: "Collection saved successfully", id });
  } catch (error) {
    res.status(500).json({ error: "Failed to save collection", details: error.message });
  }
});

/**
 * @route GET /collections/:id
 * @desc Retrieve a collection by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await getCollection(id);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve collection", details: error.message });
  }
});

/**
 * @route DELETE /collections/:id
 * @desc Delete a collection by ID
 * @access Public
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteCollection(id);
    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete collection", details: error.message });
  }
});

export default router;
