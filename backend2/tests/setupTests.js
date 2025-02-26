
import { jest } from '@jest/globals';


jest.mock('redis');

jest.mock('../services/appleService.js');
jest.mock('../services/spotifyService.js');
jest.mock('../services/analyzeService.js');


jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));



