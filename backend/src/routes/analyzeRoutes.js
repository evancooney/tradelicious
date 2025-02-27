import express from 'express';
import analyzeService from '../services/analyzeService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { text } = req.body;

    console.log(req.body)

    if (!text) {
        return res.status(400).json({ message: 'No URL provided' });
    }

    try {
        const result = await analyzeService.analyzeTrack(text);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

export default router;
