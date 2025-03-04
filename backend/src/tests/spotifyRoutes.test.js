import request from 'supertest';
import app from '../app.js';
import { jest } from '@jest/globals';
import spotifyService from '../services/spotifyService.js';

jest.clearAllMocks();

const spy = jest.spyOn(spotifyService, 'findTrackByISRC').mockResolvedValue('https://open.spotify.com/track/0987654321');


test('Spotify track search should return mocked Apple link', async () => {
    const response = await request(app).post('/spotify').send({ action: 'find', type: 'track', isrc: 'USUM71900719' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ convertedUrl: 'https://open.spotify.com/track/0987654321' });
});


