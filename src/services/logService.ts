import { promises as fs } from 'fs';

export type FileReader = (filePath: string, chunkSize?: number) => AsyncGenerator<string>;

class LogService {
  private fileReader: FileReader;

  constructor(fileReader: FileReader) {
    this.fileReader = fileReader;
  }

  /**
   * Reads the log file in reverse order, optionally filtering lines and limiting the number returned.
   *
   * @param filePath - The full path to the log file.
   * @param filterText - Optional keyword to filter lines.
   * @param maxLines - Optional maximum number of lines to return.
   * @returns An array of log lines (newest first).
   * @throws An error if the file does not exist or cannot be accessed.
   */
  async getLogLines(filePath: string, filterText?: string, maxLines?: number): Promise<string[]> {
    try {
      await fs.access(filePath);
    } catch (err) {
      const error: any = new Error('Log file not found');
      error.status = 404;
      throw error;
    }

    const lines: string[] = [];
    // Use the injected fileReader (an async generator)
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

export default LogService;

