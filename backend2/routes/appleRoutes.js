import express from 'express';
import appleService from '../services/appleService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { action, type, isrc } = req.body;

    if (action === 'find' && isrc) {
        try {
            const result = await appleService.findTrackByISRC(isrc);
            return res.json({ convertedUrl: result });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching track', error: error.message });
        }
    }

    res.status(400).json({ message: 'Invalid request' });
});

export default router;
