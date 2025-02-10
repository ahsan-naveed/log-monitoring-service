const express = require('express');
const path = require('path');
const LogService = require('../services/logService');
const fileReader = require('../utils/fileReader');
const router = express.Router();
const logService = new LogService(fileReader);

/**
 * GET /logs
 * Query Parameters:
 *   - filename (required): Name of the log file (from /var/log).
 *   - filter (optional): Keyword to filter log lines.
 *   - n (optional): Maximum number of matching log lines.
 */
router.get('/', async (req, res, next) => {
  try {
    const { filename, filter, n } = req.query;

    // Validate 'filename' param
    if (!filename) {
      return res.status(400).json({ error: 'Missing required parameter: filename' });
    }

    // Prevent directory traversal by ensuring only basenames are accepted
    if (filename !== path.basename(filename)) {
      return res.status(400).json({ error: 'Invalid filename. Only filename (no directories) allowed.' });
    }

    // Validate the 'n' param if provided
    let maxLines;
    if (n) {
      maxLines = parseInt(n, 10);
      if (isNaN(maxLines) || maxLines < 1) {
        return res.status(400).json({ error: 'Invalid n parameter. Must be a positive integer.' });
      }
    }

    const filePath = path.join('/var/log', filename);

    // Retrieve log lines from the log service
    const lines = await logService.getLogLines(filePath, filter, maxLines);

    res.json({
      filename,
      log_lines: lines
    });
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
});

module.exports = router;

