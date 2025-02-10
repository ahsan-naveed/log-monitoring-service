import { promises as fs } from 'fs';

/**
 * Asynchronous generator that yields lines from a file in reverse order.
 * This implementation reads the file in fixed-size chunks from the end.
 *
 * @param filePath - The path to the file.
 * @param chunkSize - Number of bytes to read per chunk (default: 8192).
 * @returns An async generator yielding log lines (newest first).
 */
export async function* reverseFileReader(filePath: string, chunkSize: number = 8192): AsyncGenerator<string> {
  const fileHandle = await fs.open(filePath, 'r');
  try {
    const { size: fileSize } = await fileHandle.stat();
    let position = fileSize;
    let remainder = '';

    while (position > 0) {
      const readSize = Math.min(chunkSize, position);
      position -= readSize;

      const buffer = Buffer.alloc(readSize);
      await fileHandle.read(buffer, 0, readSize, position);
      let chunk = buffer.toString('utf8');

      // Append the previous remainder to the current chunk.
      chunk = chunk + remainder;

      // Split the chunk into lines. The first element may be incomplete.
      const lines = chunk.split('\n');
      remainder = lines.shift() || '';

      // Yield complete lines in reverse order.
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].length > 0) {
          yield lines[i];
        }
      }
    }

    if (remainder) {
      yield remainder;
    }
  } finally {
    await fileHandle.close();
  }
}

export default reverseFileReader;

