# Unix Log Monitoring Service

This service provides on-demand monitoring of Unix-based logs via a REST API. It reads log files (from `/var/log`) in reverse (newest entries first), supports keyword filtering, and allows you to limit the number of returned log entries.

## Features

- **REST API Endpoint:**  
  - **GET** `/logs`  
    Returns log lines from a file in `/var/log` (newest first).

- **Query Parameters:**
  - `filename` (required): The name of the log file (e.g., `syslog` or `auth.log`). Only basenames (no directory separators) are allowed.
  - `filter` (optional): A keyword; only log lines containing this text are returned.
  - `n` (optional): The maximum number of matching log entries to retrieve.

## Prerequisites

- A Unix-based system with Node.js (version 12 or later).
- Access to log files in `/var/log`.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd log-monitoring-service
   npm install
   
## Running the Service
- **Production:**

```bash
npm start
```

By default, the service listens on port 8000. You can override this by setting the PORT environment variable.

## Running Tests
To run the tests, execute:

```bash
npm test
```

## API Usage

- n with 50
```bash
http://localhost:8000/logs?filename=syslog&n=50
```

- Retrieve lines containing "error" from /var/log/auth.log:

```bash
http://localhost:8000/logs?filename=auth.log&filter=error
```

- **Response Format**
The API responds with JSON. Example:
```js
{
  "filename": "syslog",
  "log_lines": [
    "Most recent log line...",
    "Previous log line...",
    "...",
    "Oldest log line..."
  ]
}
```

## Error Handling
- 400 Bad Request: Missing or invalid parameters.
- 404 Not Found: The specified log file could not be found.
- 500 Internal Server Error: An error occurred while processing the request.
