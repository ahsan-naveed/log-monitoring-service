import LogService from '../src/services/logService';
import { promises as fs } from 'fs';

const mockFileReader = async function* (filePath: string): AsyncGenerator<string> {
  yield 'line3';
  yield 'line2';
  yield 'line1';
};

describe('LogService', () => {
  beforeAll(() => {
    jest.spyOn(fs, 'access').mockResolvedValue(undefined);
  });

  const logService = new LogService(mockFileReader);

  test('should return all lines if no filter or maxLines provided', async () => {
    const lines = await logService.getLogLines('/fake/path');
    expect(lines).toEqual(['line3', 'line2', 'line1']);
  });

  test('should filter lines based on filter text', async () => {
    const lines = await logService.getLogLines('/fake/path', 'line2');
    expect(lines).toEqual(['line2']);
  });

  test('should limit the number of lines returned based on maxLines', async () => {
    const lines = await logService.getLogLines('/fake/path', undefined, 2);
    expect(lines).toEqual(['line3', 'line2']);
  });
});

