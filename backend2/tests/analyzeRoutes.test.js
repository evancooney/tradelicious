import request from 'supertest';
import app from '../app.js';
import { jest } from '@jest/globals';
import analyzeService from '../services/analyzeService.js';


// 🛠 Fully Mock analyzeServic

jest.spyOn(analyzeService, 'analyzeTrack').mockResolvedValue({
    originalUrl: 'https://music.apple.com/us/song/1234567890',
    convertedUrl: 'https://open.spotify.com/track/0987654321'
});


// 🛠 Reset Mocks Before Each Test
beforeEach(() => {
    jest.clearAllMocks();
});

// ✅ Test Apple to Spotify Conversion
test('POST /analyze - Apple track search should return mocked Spotify link', async () => {


    const response = await request(app).post('/analyze').send({
        url: 'https://music.apple.com/us/song/1234567890'
    });

    expect(analyzeService.analyzeTrack).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        originalUrl: 'https://music.apple.com/us/song/1234567890',
        convertedUrl: 'https://open.spotify.com/track/0987654321',
    });
});

// ✅ Test Spotify to Apple Conversion
test('POST /analyze - Spotify track search should return mocked Apple link', async () => {
   

    jest.spyOn(analyzeService, 'analyzeTrack').mockResolvedValue({
        originalUrl: 'https://music.apple.com/us/song/1234567890',
        convertedUrl: 'https://open.spotify.com/track/0987654321'
    });

    const response = await request(app).post('/analyze').send({
        url: 'https://open.spotify.com/track/0987654321'
    });

    expect(analyzeService.analyzeTrack).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        originalUrl: 'https://music.apple.com/us/song/1234567890',
        convertedUrl: 'https://open.spotify.com/track/0987654321'
    });
});

// ✅ Test Missing URL
test('POST /analyze - Missing URL should return 400', async () => {
    const response = await request(app).post('/analyze').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'No URL provided' });
});

// ✅ Test Unsupported URL
test('POST /analyze - Unsupported link format should return 400', async () => {
    jest.spyOn(analyzeService, 'analyzeTrack').mockRejectedValue(new Error('Unsupported link format'));


    const response = await request(app).post('/analyze').send({
        url: 'https://example.com/unknown-track'
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Unsupported link format' });
});
