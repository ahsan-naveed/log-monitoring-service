jest.mock('../src/utils/fileReader', () => ({
  __esModule: true,
  default: async function* () {
    yield 'line3';
    yield 'line2';
    yield 'line1';
  },
}));

import { promises as fs } from 'fs';
import request from 'supertest';
import app from '../src/app';

// Mock fs.access to always resolve (simulate file exists)
beforeAll(() => {
  jest.spyOn(fs, 'access').mockResolvedValue(undefined);
});

describe('GET /logs', () => {
  test('should return log lines for a valid request', async () => {
    const response = await request(app)
      .get('/logs')
      .query({ filename: 'test.log' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('filename', 'test.log');
    expect(response.body).toHaveProperty('log_lines');
    expect(response.body.log_lines).toEqual(['line3', 'line2', 'line1']);
  });

  test('should return 400 if filename is missing', async () => {
    const response = await request(app).get('/logs');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should return 400 if filename is not a basename', async () => {
    const response = await request(app)
      .get('/logs')
      .query({ filename: '../etc/passwd' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should filter lines if filter query provided', async () => {
    const response = await request(app)
      .get('/logs')
      .query({ filename: 'test.log', filter: 'line2' });
    expect(response.status).toBe(200);
    expect(response.body.log_lines).toEqual(['line2']);
  });

  test('should limit number of lines if n query provided', async () => {
    const response = await request(app)
      .get('/logs')
      .query({ filename: 'test.log', n: '2' });
    expect(response.status).toBe(200);
    expect(response.body.log_lines).toEqual(['line3', 'line2']);
  });
});

