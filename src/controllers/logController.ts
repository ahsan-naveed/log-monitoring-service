import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import LogService from '../services/logService';
import fileReader from '../utils/fileReader';

const router: Router = Router();
const logService = new LogService(fileReader);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename, filter, n } = req.query;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Missing required parameter: filename' });
    }

    if (filename !== path.basename(filename)) {
      return res.status(400).json({ error: 'Invalid filename. Only filename (no directories) allowed.' });
    }

    let maxLines: number | undefined;
    if (n) {
      maxLines = parseInt(n as string, 10);
      if (isNaN(maxLines) || maxLines < 1) {
        return res.status(400).json({ error: 'Invalid n parameter. Must be a positive integer.' });
      }
    }

    const filePath: string = path.join('/var/log', filename);
    const lines = await logService.getLogLines(filePath, filter as string | undefined, maxLines);

    res.json({
      filename,
      log_lines: lines,
    });
  } catch (error) {
    next(error);
  }
});

export default router;


