import express from 'express';
import analyzeService from '../services/analyzeService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'No URL provided' });
    }

    try {
        const result = await analyzeService.analyzeTrack(url);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

export default router;
