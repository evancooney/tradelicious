import request from 'supertest';
import app from '../app.js';
import { jest } from '@jest/globals';
import appleService from '../services/appleService.js'

jest.clearAllMocks()

const spy = jest.spyOn(appleService, 'findTrackByISRC').mockResolvedValue('https://music.apple.com/us/song/1234567890');


test('Apple track search should return mocked Spotify link', async () => {
    const response = await request(app).post('/apple').send({ action: 'find', type: 'track', isrc: 'USUM71900719' });
    console.log(response);
   expect(response.status).toBe(200);
    expect(response.body).toEqual({ convertedUrl: 'https://music.apple.com/us/song/1234567890' });
});
