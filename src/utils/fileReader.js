const fs = require('fs').promises;

/**
 * Asynchronous generator that yields lines from a file in reverse order.
 * This implementation reads the file in fixed-size chunks from the end.
 *
 * @param {string} filePath - The path to the file.
 * @param {number} [chunkSize=8192] - Number of bytes to read per chunk.
 * @returns {AsyncGenerator<string>} Yields lines from the file (newest first).
 */
async function* reverseFileReader(filePath, chunkSize = 8192) {
  const fileHandle = await fs.open(filePath, 'r');
  try {
    const { size: fileSize } = await fileHandle.stat();
    let position = fileSize;
    let remainder = '';

    // Read until the beginning of the file is reached.
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
      remainder = lines.shift(); // Save incomplete line for the next iteration.

      // Yield complete lines in reverse order.
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].length > 0) {
          yield lines[i];
        }
      }
    }

    // After reading all chunks, yield any remaining content.
    if (remainder) {
      yield remainder;
    }
  } finally {
    await fileHandle.close();
  }
}

module.exports = reverseFileReader;

