class LogService {
  /**
   * @param {Function} fileReader - An asynchronous generator function that reads a file in reverse.
   */
  constructor(fileReader) {
    this.fileReader = fileReader;
  }

  /**
   * Reads the log file in reverse order, optionally filtering lines and limiting the number returned.
   *
   * @param {string} filePath - The full path to the log file.
   * @param {string} [filterText] - Optional keyword to filter lines.
   * @param {number} [maxLines] - Optional maximum number of lines to return.
   * @returns {Promise<string[]>} - An array of log lines (newest first).
   * @throws {Error} If the file does not exist or cannot be accessed.
   */
  async getLogLines(filePath, filterText, maxLines) {
    const fs = require('fs').promises;
    try {
      await fs.access(filePath);
    } catch (err) {
      const error = new Error('Log file not found');
      error.status = 404;
      throw error;
    }

    const lines = [];
    // Use the injected fileReader
    for await (const line of this.fileReader(filePath)) {
      if (filterText && !line.includes(filterText)) {
        continue;
      }
      lines.push(line);
      if (maxLines && lines.length >= maxLines) {
        break;
      }
    }
    return lines;
  }
}

module.exports = LogService;

