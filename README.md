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

