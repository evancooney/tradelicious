export const createClient = jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(true),
    get: jest.fn().mockResolvedValue(null), // Simulate no cached result
    setEx: jest.fn().mockResolvedValue(true), // Simulate setting a value in Redis
}));
